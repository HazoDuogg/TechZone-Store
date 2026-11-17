import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cx } from '../lib/lopCss'
import { useAuthStore } from '../auth/auth'
import { useBamRaNgoai } from '../hooks/useBamRaNgoai'

const NHAN_VAI_TRO = { khach_hang: 'Khách hàng', nhan_vien: 'Nhân viên', admin: 'Quản trị viên' } as const

const mucMenu = 'block w-full rounded-md px-3 py-2 text-left text-[15px] font-medium text-ink transition-colors hover:bg-surface'

export default function MenuNguoiDung() {
  const chuyenTrang = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [dangMo, setDangMo] = useState(false)
  const khung = useRef<HTMLDivElement>(null)

  useBamRaNgoai(khung, dangMo, () => setDangMo(false))

  if (!user) {
    return (
      <Link to="/dang-nhap" className="hidden h-10 items-center rounded-md bg-ink px-4 text-[15px] font-semibold text-white hover:bg-black sm:inline-flex">
        Đăng nhập
      </Link>
    )
  }

  const ten = user.hoTen ?? user.email ?? 'Tài khoản'
  const chuCai = ten.trim().charAt(0).toUpperCase()

  function dangXuat() {
    logout()
    setDangMo(false)
    chuyenTrang('/')
  }

  return (
    <div ref={khung} className="relative">
      <button
        type="button"
        onClick={() => setDangMo((truoc) => !truoc)}
        aria-haspopup="menu"
        aria-expanded={dangMo}
        className="flex h-10 items-center gap-2 rounded-md pr-2 pl-1 transition-colors hover:bg-surface"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-dark">{chuCai}</span>
        <span className="hidden max-w-36 truncate text-[15px] font-semibold sm:inline">{ten}</span>
        <span aria-hidden="true" className={cx('text-xs text-muted transition-transform', dangMo && 'rotate-180')}>
          ▾
        </span>
      </button>
      {dangMo && (
        <div role="menu" className="absolute top-full right-0 z-40 mt-2 w-64 rounded-lg bg-white p-1.5 shadow-lg ring-1 ring-black/10">
          <div className="border-b border-surface-2 px-3 pt-2 pb-3">
            <p className="truncate font-bold">{ten}</p>
            <p className="truncate text-sm text-muted">{user.email}</p>
            <span className="mt-2 inline-block rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{NHAN_VAI_TRO[user.vaiTro]}</span>
          </div>
          <div className="py-1.5" onClick={() => setDangMo(false)}>
            {user.vaiTro === 'khach_hang' && (
              <Link to="/don-hang" role="menuitem" className={mucMenu}>
                Đơn hàng của tôi
              </Link>
            )}
            {user.vaiTro === 'nhan_vien' && (
              <Link to="/nhan-vien" role="menuitem" className={mucMenu}>
                Khu vực nhân viên
              </Link>
            )}
            {user.vaiTro === 'admin' && (
              <Link to="/quan-tri" role="menuitem" className={mucMenu}>
                Khu vực quản trị
              </Link>
            )}
          </div>
          <div className="border-t border-surface-2 pt-1.5">
            <button type="button" role="menuitem" onClick={dangXuat} className={cx(mucMenu, 'text-danger')}>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
