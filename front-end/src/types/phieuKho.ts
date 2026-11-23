import type { TrangThaiSanPham } from '../constants'

export type SanPhamKho = {
  id: number
  ten: string
  thuongHieu: string | null
  danhMuc: string
  trangThai: TrangThaiSanPham
  tonKho: number
}

export type DongPhieuKho = {
  idSanPham: number
  ten: string
  soLuong: number
}

export type PhieuKho = {
  id: number
  ma: string
  loai: 'nhap' | 'xuat'
  ngayLap: string
  nhanVien: string
  ghiChu: string | null
  tongSoLuong: number
  cacDong: DongPhieuKho[]
}

export type KetQuaPhieuKho = {
  id: number
  ma: string
  ngayLap: string
  nhanVien: string
  ghiChu: string | null
  cacDong: { idSanPham: number; ten: string; soLuong: number; sanPhamMoi?: boolean; cacSerial: string[] }[]
}

export type DongKiemKe = {
  idSanPham: number
  ten: string
  tonHeThong: number
  tonThucTe: number
  chenhLech: number
}

export type BienBanKiemKe = {
  id: number
  ma: string
  ngayLap: string
  nhanVien: string
  ghiChu: string | null
  soSanPham: number
  soSanPhamLech: number
  tongChenhLech: number
  cacDong: DongKiemKe[]
}
