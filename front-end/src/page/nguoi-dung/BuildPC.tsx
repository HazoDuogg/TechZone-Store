import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NutLienKet, OChon } from '../../components/GiaoDienCoBan'
import { cx } from '../../lib/lopCss'
import { AnhSanPham } from '../../components/SanPham'
import { cauHinhMau } from '../../data/duLieuMau'
import { tienVND, timSanPham } from '../../lib/dinhDang'
import { useTroLy } from '../../store/troLy'

const presets = [10, 15, 20, 30, 45]
const parts = cauHinhMau.flatMap((id) => {
  const p = timSanPham(id)
  return p ? [p] : []
})

export default function BuildPC() {
  const [budget, setBudget] = useState(20_000_000)
  const show = useTroLy((s) => s.show)
  const total = parts.reduce((s, p) => s + p.price, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-extrabold tracking-tight">Build PC theo ngân sách</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Chọn ngân sách và nhu cầu. Hệ thống đề xuất bộ linh kiện tương thích với nhau.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
        <section className="h-fit space-y-6 rounded-xl bg-surface p-6 lg:sticky lg:top-24" aria-label="Thiết lập">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="budget" className="font-semibold">Ngân sách</label>
              <output className="text-2xl font-extrabold text-brand">{tienVND(budget)}</output>
            </div>
            <input
              id="budget"
              type="range"
              min={8_000_000}
              max={60_000_000}
              step={500_000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-3 h-2 w-full accent-brand"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((m) => (
                <button
                  key={m}
                  onClick={() => setBudget(m * 1_000_000)}
                  className={cx('rounded-md px-3 py-1.5 text-sm font-semibold', budget === m * 1_000_000 ? 'bg-brand text-white' : 'bg-white hover:bg-surface-2')}
                >
                  {m} triệu
                </button>
              ))}
            </div>
          </div>
          <OChon label="Nhu cầu sử dụng">
            <option>Chơi game</option>
            <option>Đồ họa - dựng phim</option>
            <option>Văn phòng - học tập</option>
          </OChon>
          <button onClick={show} className="font-semibold text-brand hover:underline">
            Nhờ trợ lý tư vấn thêm
          </button>
        </section>

        <section aria-label="Cấu hình đề xuất">
          <ul className="space-y-3">
            {parts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 rounded-lg bg-surface p-3 sm:p-4">
                <Link to={`/san-pham/${p.id}`} className="w-20 shrink-0 overflow-hidden rounded-md sm:w-24">
                  <AnhSanPham product={p} className="p-2 [&_span]:text-[10px] [&_span:nth-child(2)]:text-sm" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-muted">{p.category}</div>
                  <Link to={`/san-pham/${p.id}`} className="font-semibold hover:text-brand">{p.name}</Link>
                </div>
                <span className="font-bold whitespace-nowrap">{tienVND(p.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-ink p-6 text-white">
            <div>
              <div className="text-white/70">Tổng cấu hình</div>
              <div className="text-3xl font-extrabold">{tienVND(total)}</div>
            </div>
            <NutLienKet to="/gio-hang" size="lg">Thêm cả bộ vào giỏ</NutLienKet>
          </div>
        </section>
      </div>
    </div>
  )
}
