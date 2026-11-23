import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { KhachHang } from './entities/khach-hang.entities';
import { DiaChiGiaoHang } from './entities/dia-chi.entities';
import { CapNhatHoSoDTO } from './dto/cap-nhat-ho-so.dto';
import { CapNhatDiaChiDTO, LuuDiaChiDTO } from './dto/dia-chi.dto';
import { boGiaTriUndefined } from '../../common/utils/bo-gia-tri-undefined';
import { LocKhachHangDTO } from './dto/loc-khach-hang.dto';
import { CapNhatGhiChuDTO } from './dto/cap-nhat-ghi-chu.dto';

const TONG_TIEN_DON = `
  SELECT dh.id, dh.id_khach_hang, dh.ma, dh.trang_thai, dh.ngay_dat,
         COALESCE(SUM(ct.so_luong * ct.don_gia), 0) - dh.tien_giam + dh.phi_van_chuyen AS tong
  FROM don_hang dh
  LEFT JOIN chi_tiet_don_hang ct ON ct.id_don_hang = dh.id
  GROUP BY dh.id
`

const SO_DIA_CHI_TOI_DA = 10

const rutGonDiaChi = ({ id, tenNguoiNhan, soDienThoai, diaChi, macDinh }: DiaChiGiaoHang) => ({ id, tenNguoiNhan, soDienThoai, diaChi, macDinh })

@Injectable()
export class KhachHangService {
  constructor(private readonly dataSource: DataSource) { }

  async xemHoSo(idTaiKhoan: number) {
    const khachHang = await this.dataSource.getRepository(KhachHang).findOne({ where: { taiKhoan: { id: idTaiKhoan } }, relations: { taiKhoan: true } })
    if (!khachHang) {
      throw new NotFoundException('Không tìm thấy hồ sơ khách hàng')
    }
    return { email: khachHang.taiKhoan.email, hoTen: khachHang.hoTen, soDienThoai: khachHang.soDienThoai, ngayTao: khachHang.ngayTao }
  }

  async capNhatHoSo(idTaiKhoan: number, dto: CapNhatHoSoDTO) {
    const repo = this.dataSource.getRepository(KhachHang)
    const khachHang = await repo.findOne({ where: { taiKhoan: { id: idTaiKhoan } } })
    if (!khachHang) {
      throw new NotFoundException('Không tìm thấy hồ sơ khách hàng')
    }
    await repo.save(Object.assign(khachHang, boGiaTriUndefined(dto)))
    return this.xemHoSo(idTaiKhoan)
  }

  async layDiaChi(idTaiKhoan: number) {
    const cacDiaChi = await this.dataSource.getRepository(DiaChiGiaoHang).find({
      where: { khachHang: { taiKhoan: { id: idTaiKhoan } } },
      order: { macDinh: 'DESC', id: 'DESC' },
    })
    return cacDiaChi.map(rutGonDiaChi)
  }

  themDiaChi(idTaiKhoan: number, dto: LuuDiaChiDTO) {
    return this.dataSource.transaction(async (manager) => {
      const khachHang = await this.khoaKhachHang(manager, idTaiKhoan)
      const soHienCo = await manager.count(DiaChiGiaoHang, { where: { khachHang: { id: khachHang.id } } })
      if (soHienCo >= SO_DIA_CHI_TOI_DA) {
        throw new BadRequestException(`Mỗi tài khoản chỉ lưu tối đa ${SO_DIA_CHI_TOI_DA} địa chỉ`)
      }

      const macDinh = dto.macDinh === true || soHienCo === 0
      if (macDinh) await this.boMacDinh(manager, khachHang.id)
      const diaChi = await manager.save(DiaChiGiaoHang, { tenNguoiNhan: dto.tenNguoiNhan, soDienThoai: dto.soDienThoai, diaChi: dto.diaChi, macDinh, khachHang })
      return rutGonDiaChi(diaChi)
    })
  }

  capNhatDiaChi(idTaiKhoan: number, id: number, dto: CapNhatDiaChiDTO) {
    return this.dataSource.transaction(async (manager) => {
      const khachHang = await this.khoaKhachHang(manager, idTaiKhoan)
      const diaChi = await this.timDiaChi(manager, khachHang.id, id)

      const { macDinh, ...thongTin } = boGiaTriUndefined(dto)
      Object.assign(diaChi, thongTin)
      if (macDinh && !diaChi.macDinh) {
        await this.boMacDinh(manager, khachHang.id)
        diaChi.macDinh = true
      }
      return rutGonDiaChi(await manager.save(diaChi))
    })
  }

  xoaDiaChi(idTaiKhoan: number, id: number) {
    return this.dataSource.transaction(async (manager) => {
      const khachHang = await this.khoaKhachHang(manager, idTaiKhoan)
      const diaChi = await this.timDiaChi(manager, khachHang.id, id)
      await manager.remove(diaChi)

      if (diaChi.macDinh) {
        const moiNhat = await manager.findOne(DiaChiGiaoHang, { where: { khachHang: { id: khachHang.id } }, order: { id: 'DESC' } })
        if (moiNhat) await manager.update(DiaChiGiaoHang, moiNhat.id, { macDinh: true })
      }
    })
  }

  private async khoaKhachHang(manager: EntityManager, idTaiKhoan: number) {
    const khachHang = await manager.createQueryBuilder(KhachHang, 'kh')
      .where('kh.id_tai_khoan = :idTaiKhoan', { idTaiKhoan })
      .setLock('pessimistic_write')
      .getOne()
    if (!khachHang) {
      throw new NotFoundException('Không tìm thấy hồ sơ khách hàng')
    }
    return khachHang
  }

  private async timDiaChi(manager: EntityManager, idKhachHang: number, id: number) {
    const diaChi = await manager.findOne(DiaChiGiaoHang, { where: { id, khachHang: { id: idKhachHang } } })
    if (!diaChi) {
      throw new NotFoundException('Không tìm thấy địa chỉ')
    }
    return diaChi
  }

  private boMacDinh(manager: EntityManager, idKhachHang: number) {
    return manager.createQueryBuilder().update(DiaChiGiaoHang).set({ macDinh: false }).where('id_khach_hang = :idKhachHang', { idKhachHang }).execute()
  }

  async timTatCa(loc: LocKhachHangDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 20
    const where = loc.query ? 'WHERE (kh.ho_ten LIKE ? OR tk.email LIKE ? OR kh.so_dien_thoai LIKE ?)' : ''
    const thamSo = loc.query ? Array(3).fill(`%${loc.query}%`) : []

    const [{ tong }] = await this.dataSource.query<{ tong: string }[]>(
      `SELECT COUNT(*) AS tong FROM khach_hang kh JOIN tai_khoan tk ON tk.id = kh.id_tai_khoan ${where}`,
      thamSo,
    )
    const dong = await this.dataSource.query<Record<string, unknown>[]>(
      `SELECT kh.id, kh.ho_ten AS hoTen, tk.email, kh.so_dien_thoai AS soDienThoai, kh.ngay_tao AS ngayTao, tk.trang_thai AS trangThaiTaiKhoan,
              COUNT(t.id) AS soDon,
              COALESCE(SUM(CASE WHEN t.trang_thai = 'hoan_tat' THEN t.tong ELSE 0 END), 0) AS tongChiTieu,
              MAX(t.ngay_dat) AS donGanNhat
       FROM khach_hang kh
       JOIN tai_khoan tk ON tk.id = kh.id_tai_khoan
       LEFT JOIN (${TONG_TIEN_DON}) t ON t.id_khach_hang = kh.id
       ${where}
       GROUP BY kh.id, tk.email, tk.trang_thai
       ORDER BY kh.id DESC LIMIT ? OFFSET ?`,
      [...thamSo, soLuong, (trang - 1) * soLuong],
    )

    return {
      duLieu: dong.map((d) => ({ ...d, soDon: Number(d.soDon), tongChiTieu: Number(d.tongChiTieu) })),
      tong: Number(tong),
      trang,
      soLuong,
      tongTrang: Math.ceil(Number(tong) / soLuong),
    }
  }

  async xemChiTiet(id: number) {
    const khachHang = await this.dataSource.getRepository(KhachHang).findOne({ where: { id }, relations: { taiKhoan: true } })
    if (!khachHang) {
      throw new NotFoundException('Không tìm thấy khách hàng')
    }

    const cacDiaChi = await this.dataSource.getRepository(DiaChiGiaoHang).find({ where: { khachHang: { id } }, order: { macDinh: 'DESC', id: 'DESC' } })
    const cacDon = await this.dataSource.query<{ ma: string; ngayDat: Date; trangThai: string; tongTien: string }[]>(
      `SELECT t.ma, t.ngay_dat AS ngayDat, t.trang_thai AS trangThai, t.tong AS tongTien FROM (${TONG_TIEN_DON}) t WHERE t.id_khach_hang = ? ORDER BY t.ngay_dat DESC, t.id DESC LIMIT 20`,
      [id],
    )

    return {
      id: khachHang.id,
      hoTen: khachHang.hoTen,
      email: khachHang.taiKhoan.email,
      soDienThoai: khachHang.soDienThoai,
      ngayTao: khachHang.ngayTao,
      trangThaiTaiKhoan: khachHang.taiKhoan.trangThai,
      ghiChu: khachHang.ghiChu,
      cacDiaChi: cacDiaChi.map(rutGonDiaChi),
      cacDon: cacDon.map((d) => ({ ...d, tongTien: Number(d.tongTien) })),
    }
  }

  async capNhatGhiChu(id: number, dto: CapNhatGhiChuDTO) {
    const repo = this.dataSource.getRepository(KhachHang)
    const khachHang = await repo.findOne({ where: { id } })
    if (!khachHang) {
      throw new NotFoundException('Không tìm thấy khách hàng')
    }
    await repo.update(id, { ghiChu: dto.ghiChu || null })
    return this.xemChiTiet(id)
  }
}
