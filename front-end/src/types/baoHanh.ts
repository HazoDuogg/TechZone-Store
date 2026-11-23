import type { TrangThaiBaoHanh } from '../constants'

export type PhieuBaoHanh = {
  id: number
  ma: string
  soSerial: string
  tenSanPham: string
  maDon: string | null
  tenNguoiNhan: string | null
  soDienThoai: string | null
  moTaLoi: string
  trangThai: TrangThaiBaoHanh
  ketQua: string | null
  ngayTiepNhan: string
  ngayHoanThanh: string | null
  nhanVien: string | null
}

export type SerialBaoHanh = {
  soSerial: string
  tenSanPham: string
  maDon: string | null
  tenNguoiNhan: string | null
  soDienThoai: string | null
  ngayMua: string | null
  hanBaoHanh: string | null
  duDieuKien: boolean
  lyDo: string | null
}

export type KetQuaTraCuuBaoHanh = { cacSerial: SerialBaoHanh[] }
