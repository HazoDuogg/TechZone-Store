export type TrangThaiBaoHanh = 'Tiếp nhận' | 'Đang kiểm tra' | 'Đang sửa' | 'Chờ linh kiện' | 'Hoàn tất' | 'Từ chối'

export type PhieuBaoHanh = {
  id: string
  serial: string
  customer: string
  issue: string
  status: TrangThaiBaoHanh
  result: string
  createdAt: string
}
