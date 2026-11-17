export type DanhMuc = {
  id: number
  ten: string
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

export type KetQuaDanhSachSanPham = {
  duLieu: SanPham[]
  tong: number
  trang: number
  soLuong: number
  tongTrang: number
}

export type HangChoMoBan = {
  id: string
  ten: string
  thuongHieu: string
  danhMuc: string
  soLuongKho: number
}
