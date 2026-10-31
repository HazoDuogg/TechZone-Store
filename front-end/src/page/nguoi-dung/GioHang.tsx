import { Link } from 'react-router-dom'
import { Nut, NutLienKet } from '../../components/GiaoDienCoBan'
import TomTatDonHang from '../../components/TomTatDonHang'
import { mucTrongGio } from '../../lib/gioHang'
import { AnhSanPham } from '../../components/SanPham'
import { tienVND } from '../../lib/dinhDang'

export default function GioHang() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Giỏ hàng</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div>
          <ul className="space-y-3">
            {mucTrongGio.map(({ product: p, qty }) => (
              <li key={p.id} className="flex gap-4 rounded-lg bg-surface p-3 sm:p-4">
                <Link to={`/san-pham/${p.id}`} className="w-24 shrink-0 overflow-hidden rounded-md sm:w-28">
                  <AnhSanPham product={p} className="p-2 [&_span]:text-[11px] [&_span:nth-child(2)]:text-base" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Link to={`/san-pham/${p.id}`} className="font-semibold hover:text-brand">{p.name}</Link>
                  <span className="font-bold text-brand">{tienVND(p.price)}</span>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex h-9 items-center rounded-md bg-white">
                      <button aria-label="Giảm" className="h-full w-9 hover:bg-surface-2">−</button>
                      <span className="w-8 text-center text-[15px] font-semibold">{qty}</span>
                      <button aria-label="Tăng" className="h-full w-9 hover:bg-surface-2">+</button>
                    </div>
                    <button className="text-sm font-semibold text-danger hover:underline">Xóa</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg bg-surface p-5">
            <label htmlFor="voucher" className="mb-2 block font-semibold">Mã giảm giá</label>
            <div className="flex gap-2">
              <input
                id="voucher"
                placeholder="Ví dụ: TECH10"
                className="h-11 min-w-0 flex-1 rounded-md bg-white px-3 uppercase focus:outline-2 focus:outline-brand"
              />
              <Nut variant="dark">Áp dụng</Nut>
            </div>
          </div>
        </div>
        <TomTatDonHang cta={<NutLienKet to="/thanh-toan" size="lg" className="w-full">Tiến hành đặt hàng</NutLienKet>} />
      </div>
    </div>
  )
}
