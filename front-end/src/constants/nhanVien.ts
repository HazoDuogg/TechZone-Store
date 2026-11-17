export const NHAN_VI_TRI = { ban_hang: 'Bán hàng', ky_thuat: 'Kỹ thuật', kho: 'Kho' } as const

export type ViTri = keyof typeof NHAN_VI_TRI

export const CAC_VI_TRI = Object.keys(NHAN_VI_TRI) as ViTri[]

export const CAC_CHUC_NANG = ['Đơn hàng', 'Tồn kho', 'Khách hàng', 'Bảo hành', 'Nhập xuất kho']

export const QUYEN_MAC_DINH: Record<ViTri, string[]> = {
  ban_hang: ['Đơn hàng', 'Tồn kho', 'Khách hàng'],
  ky_thuat: ['Bảo hành', 'Tồn kho'],
  kho: ['Tồn kho', 'Nhập xuất kho'],
}
