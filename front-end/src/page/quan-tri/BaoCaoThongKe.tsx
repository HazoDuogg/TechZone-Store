import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { ThanhTab } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsSanPham, doanhThu12Thang, tonKho } from '../../data/duLieuMau'

const ranges = ['6 tháng', '12 tháng'] as const

const top = [
  ['LG 24GN600 24" IPS 144Hz', 42],
  ['Logitech G102 Lightsync', 38],
  ['AMD Ryzen 5 7600', 27],
  ['Gigabyte B650M K', 24],
  ['Corsair Vengeance 32GB (2x16GB) DDR5 5600', 19],
] as const

const tiles = [
  ['Doanh thu', '3.990 triệu ₫'],
  ['Đơn hợp lệ', '1.284'],
  ['Giá trị trung bình / đơn', '6.658.000 ₫'],
  ['Giá trị tồn kho', '1.245.640.000 ₫'],
]

export default function BaoCaoThongKe() {
  const [range, setRange] = useState<(typeof ranges)[number]>('6 tháng')
  const data = range === '6 tháng' ? doanhThu12Thang.slice(-6) : doanhThu12Thang
  const max = Math.max(...data.map((d) => d[1]))
  const low = dsSanPham.filter((p) => (tonKho[p.id] ?? 0) < 5).slice(0, 6)

  return (
    <>
      <TieuDeTrang title="Báo cáo thống kê" desc="Doanh thu, sản phẩm bán chạy và tình trạng tồn kho." action={<ThanhTab value={range} onChange={setRange} items={ranges} />} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white p-5">
            <div className="text-sm text-muted">{k}</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">{v}</div>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-xl bg-white p-5 sm:p-6" aria-labelledby="rev">
        <h2 id="rev" className="font-bold">Doanh thu theo tháng (triệu đồng)</h2>
        <div className="mt-6 flex h-64 items-end gap-2 sm:gap-3" role="img" aria-label="Biểu đồ cột doanh thu theo tháng">
          {data.map(([m, v], i) => (
            <div key={m} className="flex h-full min-w-0 flex-1 flex-col justify-end text-center">
              <span className="mb-1 text-xs font-semibold tabular-nums sm:text-sm">{v}</span>
              <div className={cx('rounded-t-sm', i === data.length - 1 ? 'bg-brand' : 'bg-brand/35')} style={{ height: `${(v / max) * 80}%` }} />
              <span className="mt-2 text-xs text-muted sm:text-sm">{m}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="top">
          <h2 id="top" className="mb-3 font-bold">Sản phẩm bán chạy</h2>
          <div className={cx(tableWrap, 'bg-white')}>
            <table className="w-full">
              <thead><tr><th className={th}>Sản phẩm</th><th className={th}>Đã bán</th></tr></thead>
              <tbody>
                {top.map(([name, qty]) => (
                  <tr key={name}><td className={td}>{name}</td><td className={cx(td, 'font-bold tabular-nums')}>{qty}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section aria-labelledby="low">
          <h2 id="low" className="mb-3 font-bold">Cần nhập thêm</h2>
          <div className={cx(tableWrap, 'bg-white')}>
            <table className="w-full">
              <thead><tr><th className={th}>Sản phẩm</th><th className={th}>Tồn</th></tr></thead>
              <tbody>
                {low.map((p) => (
                  <tr key={p.id}><td className={td}>{p.name}</td><td className={cx(td, 'font-bold tabular-nums', (tonKho[p.id] ?? 0) === 0 ? 'text-danger' : 'text-warn')}>{tonKho[p.id] ?? 0}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
