import type { TrangThaiSanPham } from '../constants'

export type DanhMuc = {
  id: number
  ten: string
}

export type DanhMucDayDu = DanhMuc & {
  moTa: string | null
  anhDaiDien: string | null
  soSanPham: number
}

export type SanPham = {
  id: number
  ten: string
  thuongHieu: string | null
  gia: number
  giaNiemYet: number | null
  thongSo: Record<string, string> | null
  danhMuc: DanhMuc
  anh: { duongDan: string }[]
  tonKho: number
}

export type SanPhamChiTiet = SanPham & {
  moTa: string | null
  soThangBaoHanh: number
}

export type SanPhamQuanTri = SanPham & {
  trangThai: TrangThaiSanPham
}

export type SanPhamQuanTriChiTiet = SanPhamChiTiet & {
  trangThai: TrangThaiSanPham
}
