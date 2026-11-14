import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SanPham } from './entities/san-pham.entities';
import { Repository } from 'typeorm';
import { AnhSanPham } from './entities/anh-san-pham.entities';
import { ChiTietSanPham } from './entities/chi-tiet-san-pham.entities';
import { LocSanPhamDTO } from './dto/loc-san-pham.dto';

@Injectable()
export class SanPhamService {
  constructor(
    @InjectRepository(SanPham) private readonly sanhPhamRepo: Repository<SanPham>,
    @InjectRepository(AnhSanPham) private readonly anhRepo: Repository<AnhSanPham>,
    @InjectRepository(ChiTietSanPham) private readonly chiTietSanPhamRepo: Repository<ChiTietSanPham>
  ) { }

  async timTatCaSanPham(loc: LocSanPhamDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 12

    const query = this.sanhPhamRepo.createQueryBuilder('sp')
      .innerJoinAndSelect('sp.danhMuc', 'dm')
      .where("sp.trangThai = 'dang_ban'")

    if (loc.danhMuc) query.andWhere('dm.id = :danhMuc', { danhMuc: loc.danhMuc })
    if (loc.thuongHieu) query.andWhere('sp.thuongHieu = :thuongHieu', { thuongHieu: loc.thuongHieu })
    if (loc.query) query.andWhere('(sp.ten LIKE :q OR sp.thuongHieu LIKE :q)', { q: `%${loc.query}%` })
    if (loc.giaTu !== undefined) query.andWhere('sp.gia >= :giaTu', { giaTu: loc.giaTu })
    if (loc.giaDen !== undefined) query.andWhere('sp.gia <= :giaDen', { giaDen: loc.giaDen })
    if (loc.conHang) {
      query.andWhere("EXISTS (SELECT 1 FROM chi_tiet_san_pham c WHERE c.id_san_pham = sp.id AND c.trang_thai = 'trong_kho')")
    }

    if (loc.sapXep === 'gia-tang') query.orderBy('sp.gia', 'ASC').addOrderBy('sp.id', 'ASC')
    else if (loc.sapXep === 'gia-giam') query.orderBy('sp.gia', 'DESC').addOrderBy('sp.id', 'ASC')
    else query.orderBy('sp.id', 'DESC')

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
}
