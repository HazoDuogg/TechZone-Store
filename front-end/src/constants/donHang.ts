export const NHAN_TRANG_THAI_DON = {
  cho_xac_nhan: 'Chờ xác nhận',
  da_xac_nhan: 'Đã xác nhận',
  dang_giao: 'Đang giao',
  hoan_tat: 'Hoàn tất',
  da_huy: 'Đã hủy',
} as const

export type TrangThaiDon = keyof typeof NHAN_TRANG_THAI_DON

export const CAC_TRANG_THAI_DON = Object.keys(NHAN_TRANG_THAI_DON) as TrangThaiDon[]

export const CAC_BUOC_DON: TrangThaiDon[] = ['cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'hoan_tat']

export const NHAN_PHUONG_THUC: Record<string, string> = { cod: 'Thanh toán khi nhận hàng (COD)' }

export const NHAN_TRANG_THAI_THANH_TOAN: Record<string, string> = {
  cho_thanh_toan: 'Chưa thanh toán',
  thanh_cong: 'Đã thanh toán',
  that_bai: 'Không thành công',
  hoan_tien: 'Đã hoàn tiền',
}
