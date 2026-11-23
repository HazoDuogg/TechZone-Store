export const NHAN_LY_DO_XUAT_KHO = {
  tra_nha_cung_cap: 'Trả nhà cung cấp',
  hang_hong: 'Hàng hỏng',
  mat: 'Mất hàng',
  noi_bo: 'Dùng nội bộ',
  khac: 'Lý do khác',
} as const

export type LyDoXuatKho = keyof typeof NHAN_LY_DO_XUAT_KHO

export const CAC_LY_DO_XUAT_KHO = Object.keys(NHAN_LY_DO_XUAT_KHO) as LyDoXuatKho[]
