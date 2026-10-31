import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cx } from '../lib/lopCss'
import KhungTroLy from './KhungTroLy'

const Logo = ({ light }: { light?: boolean }) => (
  <Link to="/" className={cx('text-2xl font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>
    Tech<span className={light ? 'text-white/70' : 'text-brand'}>Zone</span>
  </Link>
)

const navLink = ({ isActive }: { isActive: boolean }) =>
  cx('rounded-md px-3 py-2 text-[15px] font-semibold transition-colors', isActive ? 'bg-brand-soft text-brand-dark' : 'text-ink hover:bg-surface')

export function BoCucCuaHang() {
  const nav = useNavigate()
  const [menu, setMenu] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
          <Logo />
          <form
            onSubmit={(e) => {
              e.preventDefault()
              nav('/san-pham')
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
            <NavLink to="/san-pham" className={navLink}>Sản phẩm</NavLink>
            <NavLink to="/build-pc" className={navLink}>Build PC</NavLink>
            <NavLink to="/don-hang" className={navLink}>Đơn hàng</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link to="/gio-hang" className="rounded-md px-3 py-2 text-[15px] font-semibold hover:bg-surface">Giỏ hàng</Link>
            <Link to="/dang-nhap" className="hidden h-10 items-center rounded-md bg-ink px-4 text-[15px] font-semibold text-white hover:bg-black sm:inline-flex">
              Đăng nhập
            </Link>
            <button onClick={() => setMenu((v) => !v)} aria-label="Mở menu" aria-expanded={menu} className="rounded-md px-3 py-2 text-[15px] font-semibold hover:bg-surface lg:hidden">
              Menu
            </button>
          </div>
        </div>
        {menu && (
          <nav className="bg-surface px-4 py-3 lg:hidden" onClick={() => setMenu(false)}>
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <NavLink to="/san-pham" className={navLink}>Sản phẩm</NavLink>
              <NavLink to="/build-pc" className={navLink}>Build PC</NavLink>
              <NavLink to="/don-hang" className={navLink}>Đơn hàng</NavLink>
              <NavLink to="/dang-nhap" className={navLink}>Đăng nhập</NavLink>
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
              <li><Link to="/san-pham" className="hover:text-white">Tất cả sản phẩm</Link></li>
              <li><Link to="/build-pc" className="hover:text-white">Build PC theo ngân sách</Link></li>
              <li><Link to="/don-hang" className="hover:text-white">Tra cứu đơn hàng</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold">Nội bộ</h3>
            <ul className="space-y-2 text-white/75">
              <li><Link to="/nhan-vien" className="hover:text-white">Khu vực nhân viên</Link></li>
              <li><Link to="/quan-tri" className="hover:text-white">Khu vực quản trị</Link></li>
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
  const [open, setOpen] = useState(false)

  const groups = items.reduce<Record<string, MucMenu[]>>((acc, it) => {
    const g = it.group ?? ''
      ; (acc[g] ??= []).push(it)
    return acc
  }, {})

  const side: ReactNode = (
    <nav className="flex flex-col gap-5" onClick={() => setOpen(false)}>
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
        <div className="px-3 pt-2"><Logo light /><div className="mt-1 text-sm text-white/60">{title}</div></div>
        {side}
        <div className="mt-auto space-y-1">
          <Link to="/" className="block rounded-md px-3 py-2 text-[15px] text-white/85 hover:bg-white/10">Về trang chủ</Link>
          <Link to="/dang-nhap" className="block rounded-md px-3 py-2 text-[15px] text-white/85 hover:bg-white/10">Đăng xuất</Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between bg-ink px-4 py-3 text-white lg:hidden">
          <Logo light />
          <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold">Menu</button>
        </div>
        {open && <div className="bg-ink px-4 pb-4 lg:hidden">{side}</div>}
        <div className="hidden items-center justify-end gap-3 bg-white px-8 py-3 lg:flex">
          <span className="text-[15px] text-muted">Nguyễn Văn A</span>
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
