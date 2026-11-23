import type { TrangThaiDon } from '../constants'

export type DongDonHang = {
  idSanPham: number
  ten: string
  soLuong: number
  donGia: number
  cacSerial: string[]
}

export type ThanhToanDon = {
  phuongThuc: string
  trangThai: string
  ngayThanhToan: string | null
}

export type DonHangChiTiet = {
  ma: string
  trangThai: TrangThaiDon
  ngayDat: string
  ngayHoanTat: string | null
  tenNguoiNhan: string
  soDienThoai: string
  email: string | null
  diaChi: string
  nhanVienXuLy: string | null
  cacDong: DongDonHang[]
  tamTinh: number
  tienGiam: number
  phiVanChuyen: number
  tongTien: number
  thanhToan: ThanhToanDon | null
}

export type DonHangTomTat = {
  ma: string
  tenNguoiNhan: string
  soDienThoai: string
  ngayDat: string
  trangThai: TrangThaiDon
  phuongThuc: string | null
  tongTien: number
}

export type DonHangCuaToi = {
  ma: string
  ngayDat: string
  trangThai: TrangThaiDon
  tenSanPhamDau: string
  soDong: number
  tongTien: number
}
