export type ThongTinSanPham = {
  id: string
  name: string
  brand: string
  category: string
  price: number
  oldPrice?: number
  specs: Record<string, string>
}

export type HangChoMoBan = {
  id: string
  name: string
  brand: string
  category: string
  soLuongKho: number
}

export type TrangThaiSerial = 'trong_kho' | 'da_ban'

export type ThongTinSerial = {
  serial: string
  productId: string
  status: TrangThaiSerial
  importedAt: string
  orderCode?: string
  customer?: string
  purchasedAt?: string
  warrantyUntil?: string
}
