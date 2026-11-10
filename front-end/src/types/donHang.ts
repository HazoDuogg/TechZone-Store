export type TrangThaiDon = 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang giao' | 'Hoàn tất' | 'Đã hủy'

export type DongDonHang = {
  id: string
  qty: number
  serials: string[]
}

export type ThongTinDonHang = {
  code: string
  customer: string
  phone: string
  email: string
  address: string
  items: DongDonHang[]
  discount: number
  shipping: number
  payment: 'COD'
  status: TrangThaiDon
  createdAt: string
}
