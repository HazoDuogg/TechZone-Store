import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SanPham } from './entities/san-pham.entities';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { AnhSanPham } from './entities/anh-san-pham.entities';
import { ChiTietSanPham } from './entities/chi-tiet-san-pham.entities';
import { LocSanPhamDTO } from './dto/loc-san-pham.dto';
import { LocSanPhamQuanTriDTO } from './dto/loc-san-pham-quan-tri.dto';
import { TaoSanPhamDTO } from './dto/tao-san-pham.dto';
import { boGiaTriUndefined } from '../../common/utils/bo-gia-tri-undefined';
import { CapNhatSanPhamDTO } from './dto/cap-nhat-san-pham.dto';

@Injectable()
export class SanPhamService {
  constructor(
    @InjectRepository(SanPham) private readonly sanhPhamRepo: Repository<SanPham>,
    @InjectRepository(AnhSanPham) private readonly anhRepo: Repository<AnhSanPham>,
    @InjectRepository(ChiTietSanPham) private readonly chiTietSanPhamRepo: Repository<ChiTietSanPham>,
    private readonly dataSource: DataSource

  ) { }

  async timTatCaSanPham(loc: LocSanPhamDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 12

    const query = this.sanhPhamRepo.createQueryBuilder('sp')
      .innerJoinAndSelect('sp.danhMuc', 'dm')
      .where("sp.trangThai = 'dang_ban'")

    if (loc.danhMuc) query.andWhere('dm.id = :danhMuc', { danhMuc: loc.danhMuc })
    if (loc.thuongHieu) query.andWhere('sp.thuongHieu = :thuongHieu', { thuongHieu: loc.thuongHieu })
    if (loc.query) query.andWhere('(sp.ten LIKE :q OR sp.thuongHieu LIKE :q OR dm.ten LIKE :q)', { q: `%${loc.query}%` })
    if (loc.giaTu !== undefined) query.andWhere('sp.gia >= :giaTu', { giaTu: loc.giaTu })
    if (loc.giaDen !== undefined) query.andWhere('sp.gia <= :giaDen', { giaDen: loc.giaDen })
    if (loc.conHang) {
      query.andWhere("EXISTS (SELECT 1 FROM chi_tiet_san_pham c WHERE c.id_san_pham = sp.id AND c.trang_thai = 'trong_kho')")
    }

    if (loc.sapXep === 'gia-tang') query.orderBy('sp.gia', 'ASC').addOrderBy('sp.id', 'ASC')
    else if (loc.sapXep === 'gia-giam') query.orderBy('sp.gia', 'DESC').addOrderBy('sp.id', 'ASC')
    else query.orderBy('sp.id', 'DESC')

    const [dsSanPham, tong] = await query.skip((trang - 1) * soLuong).take(soLuong).getManyAndCount()

    return {
      duLieu: await this.dinhDangDanhSach(dsSanPham),
      tong,
      trang,
      soLuong,
      tongTrang: Math.ceil(tong / soLuong),
    }
  }

  async timTheoIds(ids: number[]) {
    const dsSanPham = await this.sanhPhamRepo.find({ where: { id: In(ids), trangThai: 'dang_ban' }, relations: { danhMuc: true } })
    return this.dinhDangDanhSach(dsSanPham)
  }

  private async dinhDangDanhSach(dsSanPham: SanPham[]) {
    const ids = dsSanPham.map((sp) => sp.id)
    const anhTheoSp = await this.layAnh(ids)
    const tonTheoSp = await this.layTonKho(ids)

    return dsSanPham.map((sp) => ({
      id: sp.id,
      ten: sp.ten,
      thuongHieu: sp.thuongHieu,
      gia: sp.gia,
      giaNiemYet: sp.giaNiemYet,
      thongSo: sp.thongSo,
      danhMuc: { id: sp.danhMuc.id, ten: sp.danhMuc.ten },
      anh: anhTheoSp.get(sp.id) ?? [],
      tonKho: tonTheoSp.get(sp.id) ?? 0,
    }))
  }

  private async layAnh(ids: number[]) {
    const ketQua = new Map<number, { duongDan: string; anhChinh: boolean }[]>()
    if (ids.length === 0) {
      return ketQua
    }

    const dong = await this.anhRepo.createQueryBuilder('a')
      .select(['a.id_san_pham AS idSanPham', 'a.duong_dan AS duongDan', 'a.anh_chinh AS anhChinh'])
      .where('a.id_san_pham IN (:...ids)', { ids })
      .orderBy('a.thu_tu', 'ASC')
      .getRawMany<{ idSanPham: number; duongDan: string; anhChinh: number }>()

    for (const d of dong) {
      const ds = ketQua.get(d.idSanPham) ?? []
      ds.push({ duongDan: d.duongDan, anhChinh: Boolean(d.anhChinh) })
      ketQua.set(d.idSanPham, ds)
    }
    return ketQua
  }

  private async layTonKho(ids: number[]) {
    const ketQua = new Map<number, number>()
    if (ids.length === 0) return ketQua

    const dong = await this.chiTietSanPhamRepo.createQueryBuilder('c')
      .select('c.id_san_pham', 'idSanPham')
      .addSelect('COUNT(*)', 'soLuong')
      .where('c.id_san_pham IN (:...ids)', { ids })
      .andWhere("c.trang_thai = 'trong_kho'")
      .groupBy('c.id_san_pham')
      .getRawMany<{ idSanPham: number; soLuong: string }>()

    for (const d of dong) ketQua.set(d.idSanPham, Number(d.soLuong))
    return ketQua
  }

  async layTheoThuongHieu(danhMuc?: number) {
    const query = this.sanhPhamRepo.createQueryBuilder('sp')
      .select('DISTINCT sp.thuongHieu', 'thuongHieu')
      .where("sp.trangThai = 'dang_ban'")
      .andWhere('sp.thuongHieu IS NOT NULL')
      .orderBy('sp.thuongHieu', 'ASC')

    if (danhMuc) {
      query.andWhere('sp.id_danh_muc = :danhMuc', { danhMuc })
    }
    const dong = await query.getRawMany<{ thuongHieu: string }>()
    return dong.map((d) => d.thuongHieu)
  }

  async goiYTimKiem(tuKhoa: string) {
    const dsSanPham = await this.sanhPhamRepo.createQueryBuilder('sp')
      .innerJoin('sp.danhMuc', 'dm')
      .where("sp.trangThai = 'dang_ban'")
      .andWhere('(sp.ten LIKE :q OR sp.thuongHieu LIKE :q OR dm.ten LIKE :q)', { q: `%${tuKhoa}%` })
      .orderBy('sp.ten', 'ASC')
      .take(6)
      .getMany()

    const anhTheoSanPham = await this.layAnh(dsSanPham.map((sp) => sp.id))

    return dsSanPham.map((sp) => ({
      id: sp.id,
      ten: sp.ten,
      gia: sp.gia,
      anh: anhTheoSanPham.get(sp.id)?.[0]?.duongDan ?? null,
    }))
  }

  async timChiTietSanPham(id: number) {
    const sanPham = await this.sanhPhamRepo.findOne({
      where: { id, trangThai: 'dang_ban' },
      relations: { danhMuc: true }
    })

    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm')
    }

    const anhTheoSanPham = await this.layAnh([sanPham.id])
    const tonKhoTheoSanPham = await this.layTonKho([sanPham.id])

    return {
      id: sanPham.id,
      ten: sanPham.ten,
      thuongHieu: sanPham.thuongHieu,
      gia: sanPham.gia,
      giaNiemYet: sanPham.giaNiemYet,
      moTa: sanPham.moTa,
      thongSo: sanPham.thongSo,
      soThangBaoHanh: sanPham.soThangBaoHanh,
      danhMuc: { id: sanPham.danhMuc.id, ten: sanPham.danhMuc.ten },
      anh: anhTheoSanPham.get(sanPham.id) ?? [],
      tonKho: tonKhoTheoSanPham.get(sanPham.id) ?? 0,
    }
  }

  async timTatQuanTri(loc: LocSanPhamQuanTriDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 20

    const query = this.sanhPhamRepo.createQueryBuilder('sp').innerJoinAndSelect('sp.danhMuc', 'dm')

    if (loc.trangThai) query.andWhere('sp.trangThai = :trangThai', { trangThai: loc.trangThai })
    if (loc.danhMuc) query.andWhere('dm.id = :danhMuc', { danhMuc: loc.danhMuc })
    if (loc.query) query.andWhere('(sp.ten LIKE :q OR sp.thuongHieu LIKE :q)', { q: `%${loc.query}%` })
    query.orderBy('sp.id', 'DESC')

    const [dsSanPham, tong] = await query.skip((trang - 1) * soLuong).take(soLuong).getManyAndCount()

    const ids = dsSanPham.map((sp) => sp.id)
    const anhTheoSp = await this.layAnh(ids)
    const tonTheoSp = await this.layTonKho(ids)

    return {
      duLieu: dsSanPham.map((sp) => ({
        id: sp.id,
        ten: sp.ten,
        thuongHieu: sp.thuongHieu,
        gia: sp.gia,
        giaNiemYet: sp.giaNiemYet,
        thongSo: sp.thongSo,
        trangThai: sp.trangThai,
        danhMuc: { id: sp.danhMuc.id, ten: sp.danhMuc.ten },
        anh: anhTheoSp.get(sp.id) ?? [],
        tonKho: tonTheoSp.get(sp.id) ?? 0,
      })),
      tong,
      trang,
      soLuong,
      tongTrang: Math.ceil(tong / soLuong),
    }
  }

  async timChiTietQuanTri(id: number) {
    const sanPham = await this.sanhPhamRepo.findOne({ where: { id }, relations: { danhMuc: true } })

    if (!sanPham) {
      throw new NotFoundException('Không tìm thấy sản phẩm')
    }

    const anhTheoSp = await this.layAnh([id])
    const tonTheoSp = await this.layTonKho([id])

    return {
      id: sanPham.id,
      ten: sanPham.ten,
      thuongHieu: sanPham.thuongHieu,
      gia: sanPham.gia,
      giaNiemYet: sanPham.giaNiemYet,
      moTa: sanPham.moTa,
      thongSo: sanPham.thongSo,
      soThangBaoHanh: sanPham.soThangBaoHanh,
      trangThai: sanPham.trangThai,
      danhMuc: { id: sanPham.danhMuc.id, ten: sanPham.danhMuc.ten },
      anh: anhTheoSp.get(id) ?? [],
      tonKho: tonTheoSp.get(id) ?? 0,
    }
  }

  async taoSanPham(dto: TaoSanPhamDTO) {
    this.kiemTraMoBan(dto.gia, dto.giaNiemYet, dto.trangThai, dto.anh.length)

    try {
      const id = await this.dataSource.transaction(async (manager) => {
        const sanPham = await manager.save(SanPham, {
          danhMuc: { id: dto.idDanhMuc },
          ten: dto.ten,
          thuongHieu: dto.thuongHieu ?? null,
          gia: dto.gia,
          giaNiemYet: dto.giaNiemYet ?? null,
          moTa: dto.moTa ?? null,
          thongSo: dto.thongSo ?? null,
          soThangBaoHanh: dto.soThangBaoHanh,
          trangThai: dto.trangThai,
        })
        await this.luuAnh(manager, sanPham.id, dto.anh)
        return sanPham.id
      })
      return this.timChiTietQuanTri(id)
    } catch (error) {
      this.baoLoiDanhMuc(error)
      throw error
    }
  }

  async capNhatSanPham(id: number, dto: CapNhatSanPhamDTO) {
    try {
      await this.dataSource.transaction(async (manager) => {
        const sanPham = await manager.findOne(SanPham, { where: { id } })

        if (!sanPham) {
          throw new NotFoundException('Không tìm thấy sản phẩm')
        }

        const { idDanhMuc, anh, ...thongTin } = boGiaTriUndefined(dto)
        Object.assign(sanPham, thongTin)
        if (idDanhMuc) {
          Object.assign(sanPham, { danhMuc: { id: idDanhMuc } })
        }

        const soAnh = anh ? anh.length : await manager.count(AnhSanPham, { where: { sanPham: { id } } })
        this.kiemTraMoBan(sanPham.gia, sanPham.giaNiemYet, sanPham.trangThai, soAnh)

        await manager.save(sanPham)
        if (anh) {
          await this.luuAnh(manager, id, anh)
        }
      })
      return this.timChiTietQuanTri(id)
    } catch (error) {
      this.baoLoiDanhMuc(error)
      throw error
    }
  }

  private async luuAnh(manager: EntityManager, idSanPham: number, cacAnh: string[]) {
    await manager.createQueryBuilder().delete().from(AnhSanPham).where('id_san_pham = :idSanPham', { idSanPham }).execute()

    if (cacAnh.length > 0) {
      await manager.save(AnhSanPham, cacAnh.map((duongDan, i) => ({ sanPham: { id: idSanPham }, duongDan, anhChinh: i === 0, thuTu: i + 1 })))
    }
  }

  private kiemTraMoBan(gia: number, giaNiemYet: number | null | undefined, trangThai: string, soAnh: number) {
    if (giaNiemYet != null && giaNiemYet <= gia) {
      throw new BadRequestException('Giá niêm yết phải lớn hơn giá bán')
    }
    if (trangThai === 'dang_ban' && (gia <= 0 || soAnh === 0)) {
      throw new BadRequestException('Cần giá bán lớn hơn 0 và ít nhất 1 ảnh để mở bán')
    }
  }

  private baoLoiDanhMuc(error: unknown) {
    if ((error as { code?: string }).code === 'ER_NO_REFERENCED_ROW_2') {
      throw new BadRequestException('Danh mục không tồn tại')
    }
  }

}
