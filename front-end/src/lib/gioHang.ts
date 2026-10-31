import { gioHangMau } from '../data/duLieuMau'
import { timSanPham } from './dinhDang'

export const mucTrongGio = gioHangMau.flatMap((l) => {
  const product = timSanPham(l.id)
  return product ? [{ ...l, product }] : []
})
