import type { TrangThaiDon, ViTri } from '../constants'

export type NhanVien = {
  id: number
  hoTen: string
  soDienThoai: string
  viTri: ViTri
  trangThai: 'hoat_dong' | 'nghi_viec'
  ngayTao: string
  email: string
}

export type KhachHangTomTat = {
  id: number
  hoTen: string
  email: string
  soDienThoai: string
  ngayTao: string
  trangThaiTaiKhoan: 'hoat_dong' | 'khoa'
  soDon: number
  tongChiTieu: number
  donGanNhat: string | null
}

export type KhachHangChiTiet = Omit<KhachHangTomTat, 'soDon' | 'tongChiTieu' | 'donGanNhat'> & {
  ghiChu: string | null
  cacDiaChi: DiaChiGiaoHang[]
  cacDon: { ma: string; ngayDat: string; trangThai: TrangThaiDon; tongTien: number }[]
}

export type HoSoKhachHang = {
  email: string
  hoTen: string
  soDienThoai: string
  ngayTao: string
}

export type DiaChiGiaoHang = {
  id: number
  tenNguoiNhan: string
  soDienThoai: string
  diaChi: string
  macDinh: boolean
}
