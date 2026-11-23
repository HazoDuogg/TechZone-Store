export const NHAN_TRANG_THAI_SAN_PHAM = { dang_ban: 'Đang bán', cho_bo_sung: 'Chờ bổ sung', ngung_ban: 'Ngừng bán' } as const

export type TrangThaiSanPham = keyof typeof NHAN_TRANG_THAI_SAN_PHAM

export const CAC_TRANG_THAI_SAN_PHAM = Object.keys(NHAN_TRANG_THAI_SAN_PHAM) as TrangThaiSanPham[]
