import { Link } from 'react-router-dom'
import { NutLienKet } from '../../components/GiaoDienCoBan'
import TomTatDonHang from '../../components/TomTatDonHang'
import { AnhSanPham } from '../../components/SanPham'
import { tienVND } from '../../lib/dinhDang'
import { useGioHang } from '../../store/gioHang'

export default function GioHang() {
  const cacMuc = useGioHang((s) => s.cacMuc)
  const doiSoLuong = useGioHang((s) => s.doiSoLuong)
  const xoa = useGioHang((s) => s.xoa)

  if (cacMuc.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <div className="flex size-28 items-center justify-center rounded-full bg-surface">
          <svg
            className="size-12 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 7H6" />
          </svg>
        </div>

        <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">Giỏ hàng trống</h1>
        <p className="mt-3 max-w-sm text-lg text-muted">Bạn chưa thêm sản phẩm nào vào giỏ.</p>

        <NutLienKet to="/san-pham" size="lg" className="mt-8">
          Tiếp tục mua sắm
        </NutLienKet>
      </div>
    )
  } else {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Giỏ hàng</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div>
            <ul className="space-y-3">
              {cacMuc.map(({ sanPham: p, soLuong }) => (
                <li key={p.id} className="flex gap-4 rounded-lg bg-surface p-3 sm:p-4">
                  <Link to={`/san-pham/${p.id}`} className="w-24 shrink-0 overflow-hidden rounded-md sm:w-28">
                    <AnhSanPham product={p} className="p-2 [&_span]:text-[11px] [&_span:nth-child(2)]:text-base" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Link to={`/san-pham/${p.id}`} className="font-semibold hover:text-brand">
                      {p.ten}
                    </Link>
                    <span className="font-bold text-brand">{tienVND(p.gia)}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex h-9 items-center rounded-md bg-white">
                        <button
                          aria-label="Giảm"
                          className="h-full w-9 hover:bg-surface-2"
                          onClick={() => doiSoLuong(p.id, soLuong - 1)}
                          disabled={soLuong <= 1}>
                          −
                        </button>
                        <span className="w-8 text-center text-[15px] font-semibold">{soLuong}</span>
                        <button
                          aria-label="Tăng"
                          className="h-full w-9 hover:bg-surface-2"
                          onClick={() => doiSoLuong(p.id, soLuong + 1)}
                          disabled={soLuong >= p.tonKho}>
                          +
                        </button>
                      </div>
                      <button
                        className="text-sm font-semibold text-danger hover:underline"
                        onClick={() => xoa(p.id)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <TomTatDonHang
            cta={
              <NutLienKet to="/thanh-toan" size="lg" className="w-full">
                Tiến hành đặt hàng
              </NutLienKet>
            }
          />
        </div>
      </div>
    )
  }
}
