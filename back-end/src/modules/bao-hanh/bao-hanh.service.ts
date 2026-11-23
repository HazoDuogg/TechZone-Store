import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaoHanh } from './entities/bao-hanh.entities';
import { ChiTietSanPham } from '../san-pham/entities/chi-tiet-san-pham.entities';
import { NhanVien } from '../nhan-vien/entities/nhan-vien.entities';
import { TiepNhanBaoHanhDTO } from './dto/tiep-nhan-bao-hanh.dto';
import { CapNhatBaoHanhDTO } from './dto/cap-nhat-bao-hanh.dto';
import { LocBaoHanhDTO } from './dto/loc-bao-hanh.dto';
import { TraCuuBaoHanhDTO } from './dto/tra-cuu-bao-hanh.dto';
import { TrangThaiBaoHanh } from '../../common/enums/trang-thai-bao-hanh.enum';
import { TrangThaiDonHang } from '../../common/enums/trang-thai-don-hang.enum';
import { taoMaPhieu } from '../../common/utils/dinh-dang-ma';

const NHAN_TRANG_THAI: Record<TrangThaiBaoHanh, string> = {
  [TrangThaiBaoHanh.TIEP_NHAN]: 'Tiếp nhận',
  [TrangThaiBaoHanh.DANG_XU_LY]: 'Đang xử lý',
  [TrangThaiBaoHanh.HOAN_TAT]: 'Hoàn tất',
  [TrangThaiBaoHanh.TU_CHOI]: 'Từ chối',
}

const TRANG_THAI_TIEP_THEO: Record<TrangThaiBaoHanh, TrangThaiBaoHanh[]> = {
  [TrangThaiBaoHanh.TIEP_NHAN]: [TrangThaiBaoHanh.DANG_XU_LY, TrangThaiBaoHanh.TU_CHOI],
  [TrangThaiBaoHanh.DANG_XU_LY]: [TrangThaiBaoHanh.HOAN_TAT, TrangThaiBaoHanh.TU_CHOI],
  [TrangThaiBaoHanh.HOAN_TAT]: [],
  [TrangThaiBaoHanh.TU_CHOI]: [],
}

const KET_QUA_TOI_THIEU = 5

type DongSerial = {
  idSerial: number
  soSerial: string
  trangThaiSerial: string
  tenSanPham: string
  soThangBaoHanh: number
  maDon: string | null
  trangThaiDon: TrangThaiDonHang | null
  tenNguoiNhan: string | null
  soDienThoai: string | null
  ngayHoanTat: Date | null
  maPhieuDangMo: number | null
}

const TRUY_VAN_SERIAL = `
  SELECT c.id AS idSerial, c.so_serial AS soSerial, c.trang_thai AS trangThaiSerial,
         sp.ten AS tenSanPham, sp.so_thang_bao_hanh AS soThangBaoHanh,
         dh.ma AS maDon, dh.trang_thai AS trangThaiDon, dh.ten_nguoi_nhan AS tenNguoiNhan,
         dh.so_dien_thoai AS soDienThoai, dh.ngay_hoan_tat AS ngayHoanTat,
         (SELECT bh.id FROM bao_hanh bh WHERE bh.id_chi_tiet_san_pham = c.id AND bh.trang_thai IN ('tiep_nhan', 'dang_xu_ly') LIMIT 1) AS maPhieuDangMo
  FROM chi_tiet_san_pham c
  JOIN san_pham sp ON sp.id = c.id_san_pham
  LEFT JOIN chi_tiet_don_hang ct ON ct.id = c.id_chi_tiet_don_hang
  LEFT JOIN don_hang dh ON dh.id = ct.id_don_hang
`

const TU_PHIEU = `
  FROM bao_hanh bh
  JOIN chi_tiet_san_pham c ON c.id = bh.id_chi_tiet_san_pham
  JOIN san_pham sp ON sp.id = c.id_san_pham
  LEFT JOIN chi_tiet_don_hang ct ON ct.id = c.id_chi_tiet_don_hang
  LEFT JOIN don_hang dh ON dh.id = ct.id_don_hang
  LEFT JOIN nhan_vien nv ON nv.id = bh.id_nhan_vien
`

const CHON_PHIEU = `
  SELECT bh.id, bh.mo_ta_loi AS moTaLoi, bh.trang_thai AS trangThai, bh.ket_qua AS ketQua,
         bh.ngay_tiep_nhan AS ngayTiepNhan, bh.ngay_hoan_thanh AS ngayHoanThanh,
         c.so_serial AS soSerial, sp.ten AS tenSanPham,
         dh.ma AS maDon, dh.ten_nguoi_nhan AS tenNguoiNhan, dh.so_dien_thoai AS soDienThoai, nv.ho_ten AS nhanVien
  ${TU_PHIEU}
`

const thanhPhieu = (dong: Record<string, unknown>) => ({ ...dong, ma: taoMaPhieu('BH', dong.id as number) })

const congThang = (ngay: Date, soThang: number) => {
  const ketQua = new Date(ngay)
  ketQua.setMonth(ketQua.getMonth() + soThang)
  return ketQua
}

@Injectable()
export class BaoHanhService {
  constructor(private readonly dataSource: DataSource) { }

  async timTatCa(loc: LocBaoHanhDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 20
    const dieuKien: string[] = []
    const thamSo: unknown[] = []
    if (loc.trangThai) {
      dieuKien.push('bh.trang_thai = ?')
      thamSo.push(loc.trangThai)
    }
    if (loc.query) {
      dieuKien.push('(c.so_serial LIKE ? OR dh.ma LIKE ? OR dh.ten_nguoi_nhan LIKE ? OR dh.so_dien_thoai LIKE ?)')
      thamSo.push(...Array(4).fill(`%${loc.query}%`))
    }
    const where = dieuKien.length ? 'WHERE ' + dieuKien.join(' AND ') : ''

    const [{ tong }] = await this.dataSource.query<{ tong: string }[]>(`SELECT COUNT(*) AS tong ${TU_PHIEU} ${where}`, thamSo)
    const dong = await this.dataSource.query<Record<string, unknown>[]>(`${CHON_PHIEU} ${where} ORDER BY bh.id DESC LIMIT ? OFFSET ?`, [...thamSo, soLuong, (trang - 1) * soLuong])

    return {
      duLieu: dong.map(thanhPhieu),
      tong: Number(tong),
      trang,
      soLuong,
      tongTrang: Math.ceil(Number(tong) / soLuong),
    }
  }

  async traCuu(dto: TraCuuBaoHanhDTO) {
    if (!dto.soSerial === !dto.maDon) {
      throw new BadRequestException('Hãy nhập số serial hoặc mã đơn hàng (chỉ một trong hai)')
    }

    const cacDong = dto.soSerial
      ? await this.dataSource.query<DongSerial[]>(`${TRUY_VAN_SERIAL} WHERE c.so_serial = ?`, [dto.soSerial])
      : await this.dataSource.query<DongSerial[]>(`${TRUY_VAN_SERIAL} WHERE dh.ma = ? ORDER BY c.id`, [dto.maDon])
    if (cacDong.length === 0) {
      throw new NotFoundException(dto.soSerial ? 'Không tìm thấy số serial này' : 'Không tìm thấy đơn hàng này')
    }

    return { cacSerial: cacDong.map((dong) => this.danhGiaBaoHanh(dong)) }
  }

  async tiepNhan(dto: TiepNhanBaoHanhDTO, idTaiKhoan: number) {
    const nhanVien = await this.layNhanVienXuLy(idTaiKhoan)

    const id = await this.dataSource.transaction(async (manager) => {
      const serial = await manager.createQueryBuilder(ChiTietSanPham, 'c').where('c.so_serial = :soSerial', { soSerial: dto.soSerial }).setLock('pessimistic_write').getOne()
      if (!serial) {
        throw new NotFoundException('Không tìm thấy số serial này')
      }

      const [dong] = await manager.query<DongSerial[]>(`${TRUY_VAN_SERIAL} WHERE c.id = ?`, [serial.id])
      const danhGia = this.danhGiaBaoHanh(dong)
      if (!danhGia.duDieuKien) {
        throw new ConflictException(danhGia.lyDo)
      }

      const phieu = await manager.save(BaoHanh, { chiTietSanPham: serial, nhanVien, moTaLoi: dto.moTaLoi })
      return phieu.id
    })
    return this.xemMotPhieu(id)
  }

  async capNhat(id: number, dto: CapNhatBaoHanhDTO, idTaiKhoan: number) {
    await this.layNhanVienXuLy(idTaiKhoan)

    await this.dataSource.transaction(async (manager) => {
      const phieu = await manager.findOne(BaoHanh, { where: { id }, lock: { mode: 'pessimistic_write' } })
      if (!phieu) {
        throw new NotFoundException('Không tìm thấy phiếu bảo hành')
      }

      const ketQua = dto.ketQua || null
      if (dto.trangThai === phieu.trangThai) {
        if (phieu.trangThai !== TrangThaiBaoHanh.DANG_XU_LY) {
          throw new ConflictException(`Phiếu đã ở trạng thái "${NHAN_TRANG_THAI[phieu.trangThai]}"`)
        }
      } else if (!TRANG_THAI_TIEP_THEO[phieu.trangThai].includes(dto.trangThai)) {
        throw new ConflictException(`Không thể chuyển phiếu từ "${NHAN_TRANG_THAI[phieu.trangThai]}" sang "${NHAN_TRANG_THAI[dto.trangThai]}"`)
      }

      const ketThuc = dto.trangThai === TrangThaiBaoHanh.HOAN_TAT || dto.trangThai === TrangThaiBaoHanh.TU_CHOI
      if (ketThuc && (ketQua?.length ?? 0) < KET_QUA_TOI_THIEU) {
        throw new BadRequestException(`Hãy ghi kết quả xử lý (ít nhất ${KET_QUA_TOI_THIEU} ký tự) khi hoàn tất hoặc từ chối`)
      }

      phieu.trangThai = dto.trangThai
      if (ketQua !== null) phieu.ketQua = ketQua
      if (ketThuc) phieu.ngayHoanThanh = new Date()
      await manager.save(phieu)
    })
    return this.xemMotPhieu(id)
  }

  private async xemMotPhieu(id: number) {
    const [dong] = await this.dataSource.query<Record<string, unknown>[]>(`${CHON_PHIEU} WHERE bh.id = ?`, [id])
    return thanhPhieu(dong)
  }

  private danhGiaBaoHanh(dong: DongSerial) {
    const ngayMua = dong.ngayHoanTat
    const hanBaoHanh = ngayMua ? congThang(ngayMua, dong.soThangBaoHanh) : null
    const lyDo = this.timLyDoKhongDuDieuKien(dong, hanBaoHanh)

    return {
      soSerial: dong.soSerial,
      tenSanPham: dong.tenSanPham,
      maDon: dong.maDon,
      tenNguoiNhan: dong.tenNguoiNhan,
      soDienThoai: dong.soDienThoai,
      ngayMua,
      hanBaoHanh,
      duDieuKien: lyDo === null,
      lyDo,
    }
  }

  private timLyDoKhongDuDieuKien(dong: DongSerial, hanBaoHanh: Date | null) {
    if (!dong.maDon) return 'Serial này chưa được bán cho khách'
    if (dong.trangThaiDon !== TrangThaiDonHang.HOAN_TAT) return `Đơn ${dong.maDon} chưa hoàn tất nên chưa bắt đầu tính bảo hành`
    if (dong.soThangBaoHanh === 0) return 'Sản phẩm này không có bảo hành'
    if (hanBaoHanh && hanBaoHanh < new Date()) return 'Sản phẩm đã hết hạn bảo hành'
    if (dong.maPhieuDangMo) return `Serial đang có phiếu ${taoMaPhieu('BH', dong.maPhieuDangMo)} chưa xử lý xong`
    return null
  }

  private async layNhanVienXuLy(idTaiKhoan: number) {
    const nhanVien = await this.dataSource.getRepository(NhanVien).findOne({ where: { taiKhoan: { id: idTaiKhoan } } })
    if (!nhanVien) {
      throw new ForbiddenException('Chỉ nhân viên kỹ thuật mới tiếp nhận và cập nhật được phiếu bảo hành')
    }
    return nhanVien
  }
}
