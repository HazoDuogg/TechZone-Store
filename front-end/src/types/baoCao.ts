export type BaoCaoTongQuan = {
  soThang: 6 | 12
  tong: {
    doanhThu: number
    soDonHoanTat: number
    giaTriTrungBinh: number
    soDonDaHuy: number
    soDonDangXuLy: number
    khachHangMoi: number
    giaTriTonKho: number
    soSanPhamTonKho: number
  }
  doanhThuTheoThang: { thang: string; doanhThu: number; soDon: number }[]
  banChay: { idSanPham: number; ten: string; soLuong: number; doanhThu: number }[]
  canNhapThem: { idSanPham: number; ten: string; tonKho: number }[]
  baoHanh: Partial<Record<'tiep_nhan' | 'dang_xu_ly' | 'hoan_tat' | 'tu_choi', number>>
}
