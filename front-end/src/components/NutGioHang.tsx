import { Link } from 'react-router-dom'
import { useGioHang } from '../store/gioHang'

export default function NutGioHang() {
  const tongSoLuong = useGioHang((s) => s.cacMuc.reduce((tong, muc) => tong + muc.soLuong, 0))

  return (
    <Link
      to="/gio-hang"
      title="Giỏ hàng"
      aria-label={tongSoLuong > 0 ? `Giỏ hàng, ${tongSoLuong} sản phẩm` : 'Giỏ hàng'}
      className="relative flex size-10 items-center justify-center rounded-md transition-colors hover:bg-surface"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-6">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {tongSoLuong > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] leading-none font-bold text-white">
          {tongSoLuong > 99 ? '99+' : tongSoLuong}
        </span>
      )}
    </Link>
  )
}
