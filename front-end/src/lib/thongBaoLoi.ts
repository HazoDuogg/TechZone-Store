import axios from 'axios'

export function layThongBaoLoi(error: unknown, macDinh = 'Có lỗi xảy ra') {
  if (axios.isAxiosError(error)) {
    const thongBao = error.response?.data?.message
    if (Array.isArray(thongBao)) {
      return thongBao
      .map((loi) => loi.replace(/^[a-zA-Z]+\.\d+(?:\.[a-zA-Z]+\.\d+)*\s*\./, ''))
      .join(',')
    }
    if (typeof thongBao === 'string') return thongBao
  }
  return macDinh
}
