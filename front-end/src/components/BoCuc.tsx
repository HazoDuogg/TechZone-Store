import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cx } from '../lib/lopCss'
import KhungTroLy from './KhungTroLy'
import { useAuthStore } from '../auth/auth'

const Logo = ({ light }: { light?: boolean }) => (
  <Link to="/" className={cx('text-2xl font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>
    Tech<span className={light ? 'text-white/70' : 'text-brand'}>Zone</span>
  </Link>
)

const navLink = ({ isActive }: { isActive: boolean }) =>
  cx('rounded-md px-3 py-2 text-[15px] font-semibold transition-colors', isActive ? 'bg-brand-soft text-brand-dark' : 'text-ink hover:bg-surface')

const NHAN_VAI_TRO = { khach_hang: 'Khách hàng', nhan_vien: 'Nhân viên', admin: 'Quản trị viên' } as const

const mucMenu = 'block w-full rounded-md px-3 py-2 text-left text-[15px] font-medium text-ink transition-colors hover:bg-surface'

function MenuNguoiDung() {
  const chuyenTrang = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [dangMo, setDangMo] = useState(false)
  const khung = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dangMo) return
    const khiBamNgoai = (e: MouseEvent) => {
      if (!khung.current?.contains(e.target as Node)) setDangMo(false)
    }
    const khiNhanPhim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDangMo(false)
    }
    document.addEventListener('mousedown', khiBamNgoai)
    document.addEventListener('keydown', khiNhanPhim)
    return () => {
      document.removeEventListener('mousedown', khiBamNgoai)
      document.removeEventListener('keydown', khiNhanPhim)
    }
  }, [dangMo])

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

export function BoCucCuaHang() {
  const chuyenTrang = useNavigate()
  const [dangMoMenu, setDangMoMenu] = useState(false)
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
          <Logo />
          <form
            onSubmit={(e) => {
              e.preventDefault()
              chuyenTrang('/san-pham')
            }}
            className="hidden flex-1 md:block"
            role="search"
          >
            <input
              aria-label="Tìm kiếm sản phẩm"
              placeholder="Tìm CPU, VGA, RAM, màn hình…"
              className="h-11 w-full max-w-xl rounded-md bg-surface px-4 text-[15px] focus:bg-white focus:outline-2 focus:outline-brand"
            />
          </form>
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            <NavLink to="/san-pham" className={navLink}>
              Sản phẩm
            </NavLink>
            <NavLink to="/build-pc" className={navLink}>
              Build PC
            </NavLink>
            <NavLink to="/don-hang" className={navLink}>
              Đơn hàng
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link to="/gio-hang" className="rounded-md px-3 py-2 text-[15px] font-semibold hover:bg-surface">
              Giỏ hàng
            </Link>
            <MenuNguoiDung />
            <button
              onClick={() => setDangMoMenu((truoc) => !truoc)}
              aria-label="Mở menu"
              aria-expanded={dangMoMenu}
              className="rounded-md px-3 py-2 text-[15px] font-semibold hover:bg-surface lg:hidden"
            >
              Menu
            </button>
          </div>
        </div>
        {dangMoMenu && (
          <nav className="bg-surface px-4 py-3 lg:hidden" onClick={() => setDangMoMenu(false)}>
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <NavLink to="/san-pham" className={navLink}>
                Sản phẩm
              </NavLink>
              <NavLink to="/build-pc" className={navLink}>
                Build PC
              </NavLink>
              <NavLink to="/don-hang" className={navLink}>
                Đơn hàng
              </NavLink>
              {!user && (
                <NavLink to="/dang-nhap" className={navLink}>
                  Đăng nhập
                </NavLink>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo light />
            <p className="mt-4 max-w-sm text-white/75">Linh kiện và thiết bị máy tính chính hãng, bảo hành rõ ràng, có trợ lý tư vấn cấu hình ngay trên website.</p>
          </div>
          <div>
            <h3 className="mb-3 font-bold">Mua sắm</h3>
            <ul className="space-y-2 text-white/75">
              <li>
                <Link to="/san-pham" className="hover:text-white">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/build-pc" className="hover:text-white">
                  Build PC theo ngân sách
                </Link>
              </li>
              <li>
                <Link to="/don-hang" className="hover:text-white">
                  Tra cứu đơn hàng
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold">Nội bộ</h3>
            <ul className="space-y-2 text-white/75">
              <li>
                <Link to="/nhan-vien" className="hover:text-white">
                  Khu vực nhân viên
                </Link>
              </li>
              <li>
                <Link to="/quan-tri" className="hover:text-white">
                  Khu vực quản trị
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-black/30 py-4 text-center text-sm text-white/60">© 2026 TechZone</div>
      </footer>
      <KhungTroLy />
    </div>
  )
}

export type MucMenu = { to: string; label: string; group?: string }

export function BoCucQuanLy({ title, items }: { title: string; items: MucMenu[] }) {
  const chuyenTrang = useNavigate()
  const [dangMoMenu, setDangMoMenu] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  function dangXuat() {
    logout()
    chuyenTrang('/dang-nhap')
  }

  const groups = items.reduce<Record<string, MucMenu[]>>((acc, it) => {
    const g = it.group ?? ''
    ;(acc[g] ??= []).push(it)
    return acc
  }, {})

  const side: ReactNode = (
    <nav className="flex flex-col gap-5" onClick={() => setDangMoMenu(false)}>
      {Object.entries(groups).map(([g, list]) => (
        <div key={g}>
          {g && <div className="mb-1.5 px-3 text-sm font-semibold text-white/55">{g}</div>}
          <div className="flex flex-col gap-0.5">
            {list.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  cx('rounded-md px-3 py-2 text-[15px] font-medium transition-colors', isActive ? 'bg-white text-ink' : 'text-white/85 hover:bg-white/10')
                }
              >
                {it.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col gap-8 bg-ink p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
        <div className="px-3 pt-2">
          <Logo light />
          <div className="mt-1 text-sm text-white/60">{title}</div>
        </div>
        {side}
        <div className="mt-auto space-y-1">
          <Link to="/" className="block rounded-md px-3 py-2 text-[15px] text-white/85 hover:bg-white/10">
            Về trang chủ
          </Link>
          <button type="button" onClick={dangXuat} className="block w-full rounded-md px-3 py-2 text-left text-[15px] text-white/85 hover:bg-white/10">
            Đăng xuất
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between bg-ink px-4 py-3 text-white lg:hidden">
          <Logo light />
          <button onClick={() => setDangMoMenu((truoc) => !truoc)} aria-expanded={dangMoMenu} className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold">
            Menu
          </button>
        </div>
        {dangMoMenu && <div className="bg-ink px-4 pb-4 lg:hidden">{side}</div>}
        <div className="hidden items-center justify-end gap-3 bg-white px-8 py-3 lg:flex">
          <span className="text-[15px] text-muted">{user?.hoTen ?? user?.email}</span>
          <span className="rounded bg-brand-soft px-2 py-0.5 text-sm font-semibold text-brand-dark">{title}</span>
        </div>
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function TieuDeTrang({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-muted">{desc}</p>}
      </div>
      {action}
    </div>
  )
}
