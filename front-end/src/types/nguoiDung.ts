import type { ViTri } from '../constants'

export type NhanVien = {
  id: number
  hoTen: string
  soDienThoai: string
  viTri: ViTri
  trangThai: 'hoat_dong' | 'nghi_viec'
  ngayTao: string
  email: string
}

export type ThongTinKhachHang = {
  id: number
  name: string
  phone: string
  email: string
  address: string
  note: string
}
