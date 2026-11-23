import { taoMaPhieu } from '../../common/utils/dinh-dang-ma';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PhieuNhapXuat } from './entities/phieu-nhap-xuat.entities';
import { ChiTietPhieuKho } from './entities/chi-tiet-phieu-kho.entities';
import { SanPham } from '../san-pham/entities/san-pham.entities';
import { ChiTietSanPham } from '../san-pham/entities/chi-tiet-san-pham.entities';
import { NhanVien } from '../nhan-vien/entities/nhan-vien.entities';
import { LoaiPhieuKho } from '../../common/enums/loai-phieu-kho.enum';
import { NhapKhoDTO } from './dto/nhap-kho.dto';
import { LocPhieuKhoDTO } from './dto/loc-phieu-kho.dto';
import { XuatKhoDTO } from './dto/xuat-kho.dto';
import { LyDoXuatKho } from '../../common/enums/ly-do-xuat-kho.enum';

const NHAN_LY_DO: Record<LyDoXuatKho, string> = {
  [LyDoXuatKho.TRA_NHA_CUNG_CAP]: 'Trả nhà cung cấp',
  [LyDoXuatKho.HANG_HONG]: 'Hàng hỏng',
  [LyDoXuatKho.MAT]: 'Mất hàng',
  [LyDoXuatKho.NOI_BO]: 'Dùng nội bộ',
  [LyDoXuatKho.KHAC]: 'Lý do khác',
}

const MAU_TIEN_TO_SERIAL = /^(SN-[A-Z0-9]{2,12}-)[0-9]{4,6}$/

const maPhieu = (loai: LoaiPhieuKho, id: number) => taoMaPhieu(loai === LoaiPhieuKho.NHAP ? 'PN' : 'PX', id)

@Injectable()
export class PhieuKhoService {
  constructor(
    @InjectRepository(PhieuNhapXuat) private readonly phieuRepo: Repository<PhieuNhapXuat>,
    private readonly dataSource: DataSource,
  ) { }

  async timTatCa(loc: LocPhieuKhoDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 20

    const query = this.phieuRepo.createQueryBuilder('p').innerJoinAndSelect('p.nhanVien', 'nv')
    if (loc.loai) query.where('p.loai = :loai', { loai: loc.loai })
    const [dsPhieu, tong] = await query.orderBy('p.id', 'DESC').skip((trang - 1) * soLuong).take(soLuong).getManyAndCount()

    const ids = dsPhieu.map((p) => p.id)
    const cacDong = ids.length
      ? await this.dataSource.getRepository(ChiTietPhieuKho).createQueryBuilder('ct')
        .innerJoin('ct.sanPham', 'sp')
        .select('ct.id_phieu_nhap_xuat', 'idPhieu')
        .addSelect('sp.id', 'idSanPham')
        .addSelect('sp.ten', 'ten')
        .addSelect('ct.so_luong', 'soLuong')
        .where('ct.id_phieu_nhap_xuat IN (:...ids)', { ids })
        .orderBy('ct.id', 'ASC')
        .getRawMany<{ idPhieu: number; idSanPham: number; ten: string; soLuong: number }>()
      : []

    return {
      duLieu: dsPhieu.map((p) => {
        const dongCuaPhieu = cacDong.filter((d) => d.idPhieu === p.id).map(({ idSanPham, ten, soLuong }) => ({ idSanPham, ten, soLuong }))
        return {
          id: p.id,
          ma: maPhieu(p.loai, p.id),
          loai: p.loai,
          ngayLap: p.ngayLap,
          nhanVien: p.nhanVien.hoTen,
          ghiChu: p.ghiChu,
          tongSoLuong: dongCuaPhieu.reduce((tongSl, d) => tongSl + d.soLuong, 0),
          cacDong: dongCuaPhieu,
        }
      }),
      tong,
      trang,
      soLuong,
      tongTrang: Math.ceil(tong / soLuong),
    }
  }

  async timSanPham(tuKhoa?: string) {
    const query = this.dataSource.getRepository(SanPham).createQueryBuilder('sp').innerJoin('sp.danhMuc', 'dm')
    if (tuKhoa) query.where('(sp.ten LIKE :q OR sp.thuong_hieu LIKE :q)', { q: `%${tuKhoa}%` })

    const dsSanPham = await query
      .select('sp.id', 'id')
      .addSelect('sp.ten', 'ten')
      .addSelect('sp.thuong_hieu', 'thuongHieu')
      .addSelect('dm.ten', 'danhMuc')
      .addSelect('sp.trang_thai', 'trangThai')
      .orderBy('sp.ten', 'ASC')
      .limit(20)
      .getRawMany<{ id: number; ten: string; thuongHieu: string | null; danhMuc: string; trangThai: string }>()

    const ids = dsSanPham.map((sp) => sp.id)
    const tonKho = ids.length
      ? await this.dataSource.getRepository(ChiTietSanPham).createQueryBuilder('c')
        .select('c.id_san_pham', 'idSanPham')
        .addSelect('COUNT(*)', 'soLuong')
        .where('c.id_san_pham IN (:...ids)', { ids })
        .andWhere("c.trang_thai = 'trong_kho'")
        .groupBy('c.id_san_pham')
        .getRawMany<{ idSanPham: number; soLuong: string }>()
      : []

    return dsSanPham.map((sp) => ({ ...sp, tonKho: Number(tonKho.find((t) => t.idSanPham === sp.id)?.soLuong ?? 0) }))
  }

  async nhapKho(dto: NhapKhoDTO, idTaiKhoan: number) {
    const nhanVien = await this.layNhanVienLapPhieu(idTaiKhoan, 'nhập')
    this.kiemTraCacDong(dto)

    try {
      return await this.dataSource.transaction(async (manager) => {
        const phieu = await manager.save(PhieuNhapXuat, { nhanVien, loai: LoaiPhieuKho.NHAP, ghiChu: dto.ghiChu ?? null })
        const ketQua: { idSanPham: number; ten: string; soLuong: number; sanPhamMoi: boolean; cacSerial: string[] }[] = []
        const cacDongTheoThuTu = [...dto.cacDong].sort((a, b) => (a.idSanPham ?? 0) - (b.idSanPham ?? 0))

        for (const dong of cacDongTheoThuTu) {
          const sanPham = dong.sanPhamMoi
            ? await manager.save(SanPham, { danhMuc: { id: dong.sanPhamMoi.idDanhMuc }, ten: dong.sanPhamMoi.ten, thuongHieu: dong.sanPhamMoi.thuongHieu ?? null, gia: 0, trangThai: 'cho_bo_sung' })
            : await manager.findOne(SanPham, { where: { id: dong.idSanPham }, lock: { mode: 'pessimistic_write' } })
          if (!sanPham) {
            throw new NotFoundException('Không tìm thấy sản phẩm có mã ' + dong.idSanPham)
          }

          const cacSerial = dong.cacSerial ?? (await this.sinhSerial(manager, sanPham.id, dong.soLuong))
          await manager.save(ChiTietSanPham, cacSerial.map((soSerial) => ({ sanPham: { id: sanPham.id }, soSerial })))
          await manager.save(ChiTietPhieuKho, { phieuNhapXuat: phieu, sanPham: { id: sanPham.id }, soLuong: dong.soLuong })
          ketQua.push({ idSanPham: sanPham.id, ten: sanPham.ten, soLuong: dong.soLuong, sanPhamMoi: !!dong.sanPhamMoi, cacSerial })
        }

        return { id: phieu.id, ma: maPhieu(LoaiPhieuKho.NHAP, phieu.id), ngayLap: phieu.ngayLap, nhanVien: nhanVien.hoTen, ghiChu: phieu.ghiChu, cacDong: ketQua }
      })
    } catch (error) {
      const loi = error as { code?: string; sqlMessage?: string }
      if (loi.code === 'ER_DUP_ENTRY') {
        const soSerial = /Duplicate entry '([^']+)'/.exec(loi.sqlMessage ?? '')?.[1]
        throw new ConflictException('Số serial đã tồn tại trong kho: ' + (soSerial ?? ''))
      }
      if (loi.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestException('Danh mục không tồn tại')
      }
      throw error
    }
  }

  async xuatKho(dto: XuatKhoDTO, idTaiKhoan: number) {
    const nhanVien = await this.layNhanVienLapPhieu(idTaiKhoan, 'xuất')
    this.kiemTraDongXuat(dto)

    return this.dataSource.transaction(async (manager) => {
      const ghiChu = NHAN_LY_DO[dto.lyDo] + (dto.ghiChu ? ' · ' + dto.ghiChu : '')
      const phieu = await manager.save(PhieuNhapXuat, { nhanVien, loai: LoaiPhieuKho.XUAT, ghiChu })
      const ketQua: { idSanPham: number; ten: string; soLuong: number; cacSerial: string[] }[] = []

      const cacDongTheoThuTu = [...dto.cacDong].sort((a, b) => a.idSanPham - b.idSanPham)
      for (const dong of cacDongTheoThuTu) {
        const sanPham = await manager.findOne(SanPham, { where: { id: dong.idSanPham } })
        if (!sanPham) {
          throw new NotFoundException('Không tìm thấy sản phẩm có mã ' + dong.idSanPham)
        }

        const cacSerial = dong.cacSerial
          ? await this.layTheoSoSerial(manager, sanPham, dong.cacSerial)
          : await this.layTheoThuTuNhap(manager, sanPham, dong.soLuong)
        for (const serial of cacSerial) {
          serial.trangThai = 'loi'
        }
        await manager.save(cacSerial)
        await manager.save(ChiTietPhieuKho, { phieuNhapXuat: phieu, sanPham: { id: sanPham.id }, soLuong: dong.soLuong })
        ketQua.push({ idSanPham: sanPham.id, ten: sanPham.ten, soLuong: dong.soLuong, cacSerial: cacSerial.map((serial) => serial.soSerial) })
      }

      return { id: phieu.id, ma: maPhieu(LoaiPhieuKho.XUAT, phieu.id), ngayLap: phieu.ngayLap, nhanVien: nhanVien.hoTen, ghiChu: phieu.ghiChu, cacDong: ketQua }
    })
  }

  private async layNhanVienLapPhieu(idTaiKhoan: number, loai: 'nhập' | 'xuất') {
    const nhanVien = await this.dataSource.getRepository(NhanVien).findOne({ where: { taiKhoan: { id: idTaiKhoan } } })
    if (!nhanVien) {
      throw new ForbiddenException(`Chỉ nhân viên kho mới lập được phiếu ${loai}`)
    }
    return nhanVien
  }

  private kiemTraDongXuat(dto: XuatKhoDTO) {
    const daCo = new Set<number>()
    const tatCaSerial = new Set<string>()

    for (const dong of dto.cacDong) {
      if (daCo.has(dong.idSanPham)) {
        throw new BadRequestException('Một sản phẩm chỉ được xuất hiện ở một dòng trong cùng phiếu')
      }
      daCo.add(dong.idSanPham)

      if (dong.cacSerial) {
        if (dong.cacSerial.length !== dong.soLuong) {
          throw new BadRequestException(`Số serial (${dong.cacSerial.length}) phải bằng số lượng xuất (${dong.soLuong})`)
        }
        for (const soSerial of dong.cacSerial) {
          if (tatCaSerial.has(soSerial)) {
            throw new BadRequestException('Số serial bị trùng trong phiếu: ' + soSerial)
          }
          tatCaSerial.add(soSerial)
        }
      }
    }
  }

  private async layTheoSoSerial(manager: EntityManager, sanPham: SanPham, cacSoSerial: string[]) {
    const cacSerial = await manager.createQueryBuilder(ChiTietSanPham, 'c')
      .where('c.id_san_pham = :idSanPham', { idSanPham: sanPham.id })
      .andWhere('c.so_serial IN (:...cacSoSerial)', { cacSoSerial })
      .setLock('pessimistic_write')
      .getMany()

    for (const soSerial of cacSoSerial) {
      const serial = cacSerial.find((s) => s.soSerial === soSerial)
      if (!serial) {
        const coO = await manager.exists(ChiTietSanPham, { where: { soSerial } })
        if (coO) throw new ConflictException(`Serial ${soSerial} không thuộc sản phẩm "${sanPham.ten}"`)
        throw new NotFoundException('Không tìm thấy serial ' + soSerial)
      }
      if (serial.trangThai !== 'trong_kho') {
        throw new ConflictException(`Serial ${soSerial} không còn trong kho`)
      }
    }
    return cacSerial
  }

  private async layTheoThuTuNhap(manager: EntityManager, sanPham: SanPham, soLuong: number) {
    const cacSerial = await manager.createQueryBuilder(ChiTietSanPham, 'c')
      .where('c.id_san_pham = :idSanPham', { idSanPham: sanPham.id })
      .andWhere("c.trang_thai = 'trong_kho'")
      .orderBy('c.ngay_nhap', 'ASC')
      .addOrderBy('c.id', 'ASC')
      .limit(soLuong)
      .setLock('pessimistic_write')
      .getMany()

    if (cacSerial.length < soLuong) {
      throw new ConflictException(`"${sanPham.ten}" chỉ còn ${cacSerial.length} sản phẩm trong kho, cần xuất ${soLuong}`)
    }
    return cacSerial
  }

  private kiemTraCacDong(dto: NhapKhoDTO) {
    const daCo = new Set<number>()
    const tatCaSerial = new Set<string>()

    for (const dong of dto.cacDong) {
      if (!!dong.idSanPham === !!dong.sanPhamMoi) {
        throw new BadRequestException('Mỗi dòng phải chọn sản phẩm có sẵn hoặc khai báo sản phẩm mới (chỉ một trong hai)')
      }
      if (dong.idSanPham) {
        if (daCo.has(dong.idSanPham)) {
          throw new BadRequestException('Một sản phẩm chỉ được xuất hiện ở một dòng trong cùng phiếu')
        }
        daCo.add(dong.idSanPham)
      }
      if (dong.cacSerial) {
        if (dong.cacSerial.length !== dong.soLuong) {
          throw new BadRequestException(`Số serial (${dong.cacSerial.length}) phải bằng số lượng nhập (${dong.soLuong})`)
        }
        for (const soSerial of dong.cacSerial) {
          if (tatCaSerial.has(soSerial)) {
            throw new BadRequestException('Số serial bị trùng trong phiếu: ' + soSerial)
          }
          tatCaSerial.add(soSerial)
        }
      }
    }
  }

  private async sinhSerial(manager: EntityManager, idSanPham: number, soLuong: number) {
    const ganNhat = await manager.createQueryBuilder(ChiTietSanPham, 'c')
      .select('c.so_serial', 'soSerial')
      .where('c.id_san_pham = :idSanPham', { idSanPham })
      .orderBy('c.id', 'DESC')
      .limit(1)
      .getRawOne<{ soSerial: string }>()
    const tienTo = (ganNhat && MAU_TIEN_TO_SERIAL.exec(ganNhat.soSerial)?.[1]) || `SN-P${idSanPham}-`

    const lonNhat = await manager.createQueryBuilder(ChiTietSanPham, 'c')
      .select('MAX(CAST(SUBSTRING(c.so_serial, :viTri) AS UNSIGNED))', 'so')
      .where('c.so_serial LIKE :mau', { mau: tienTo + '%', viTri: tienTo.length + 1 })
      .setLock('pessimistic_write')
      .getRawOne<{ so: string | null }>()
    const batDau = Number(lonNhat?.so ?? 0) + 1

    if (batDau + soLuong - 1 > 999999) {
      throw new ConflictException('Đã hết dải số serial cho sản phẩm này')
    }
    return Array.from({ length: soLuong }, (_, i) => tienTo + String(batDau + i).padStart(4, '0'))
  }
}
