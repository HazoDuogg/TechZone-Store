export const NHAN_TRANG_THAI_BAO_HANH = {
  tiep_nhan: 'Tiếp nhận',
  dang_xu_ly: 'Đang xử lý',
  hoan_tat: 'Hoàn tất',
  tu_choi: 'Từ chối',
} as const

export type TrangThaiBaoHanh = keyof typeof NHAN_TRANG_THAI_BAO_HANH

export const CAC_TRANG_THAI_BAO_HANH = Object.keys(NHAN_TRANG_THAI_BAO_HANH) as TrangThaiBaoHanh[]

export const BUOC_TIEP_BAO_HANH: Record<TrangThaiBaoHanh, TrangThaiBaoHanh[]> = {
  tiep_nhan: ['dang_xu_ly', 'tu_choi'],
  dang_xu_ly: ['dang_xu_ly', 'hoan_tat', 'tu_choi'],
  hoan_tat: [],
  tu_choi: [],
}
