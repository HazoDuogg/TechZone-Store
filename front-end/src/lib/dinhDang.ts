import { dsSanPham, type ThongTinDonHang } from '../data/duLieuMau'

export const tienVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫'

export const ngayVN = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const ngayGioVN = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })

export const timSanPham = (id: string) => dsSanPham.find((p) => p.id === id)

export const tamTinhDon = (o: Pick<ThongTinDonHang, 'items'>) =>
  o.items.reduce((s, i) => s + (timSanPham(i.id)?.price ?? 0) * i.qty, 0)

export const tongTienDon = (o: ThongTinDonHang) => tamTinhDon(o) - o.discount + o.shipping
