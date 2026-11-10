export const CAC_VI_TRI = ['Bán hàng', 'Kỹ thuật', 'Kho'] as const

export type ViTri = (typeof CAC_VI_TRI)[number]

export const CAC_CHUC_NANG = ['Đơn hàng', 'Tồn kho', 'Khách hàng', 'Bảo hành', 'Nhập xuất kho']

export const QUYEN_MAC_DINH: Record<ViTri, string[]> = {
  'Bán hàng': ['Đơn hàng', 'Tồn kho', 'Khách hàng'],
  'Kỹ thuật': ['Bảo hành', 'Tồn kho'],
  Kho: ['Tồn kho', 'Nhập xuất kho'],
}
