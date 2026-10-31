import { Link } from 'react-router-dom'
import { tonKho, type ThongTinSanPham } from '../data/duLieuMau'
import { cx } from '../lib/lopCss'
import { tienVND } from '../lib/dinhDang'

const tints: Record<string, string> = {
  CPU: 'bg-[#dbe8fb] text-[#0a3f91]',
  Mainboard: 'bg-[#d9efe6] text-[#0d5a43]',
  RAM: 'bg-[#fbe6cf] text-[#8a4a05]',
  VGA: 'bg-[#e0e4ea] text-[#1c2733]',
  SSD: 'bg-[#f8dcdc] text-[#8e1f1f]',
  Nguồn: 'bg-[#f3ecc8] text-[#6b5a00]',
  Case: 'bg-[#dde5e0] text-[#2a4a3a]',
  'Màn hình': 'bg-[#d6edf2] text-[#0b5566]',
  Chuột: 'bg-[#f2dfe9] text-[#7a1f4d]',
}

const shortName = (p: ThongTinSanPham) => {
  const m = p.name.match(/(Ryzen \d \w+|i\d-\w+|RTX \d+\s?\w*|RX \d+|B\d{3}\w*|Z\d{3}|H\d{3}|DDR\d [\d]+|\d+(GB|TB)|\d+W|G\d+|H5|DeathAdder V3|\d+")/i)
  return m ? m[0] : p.brand
}

export function AnhSanPham({ product, className }: { product: ThongTinSanPham; className?: string }) {
  return (
    <div
      className={cx('flex aspect-square flex-col justify-between p-5', tints[product.category] ?? 'bg-surface', className)}
      aria-hidden="true"
    >
      <span className="text-sm font-semibold opacity-80">{product.category}</span>
      <span className="text-[clamp(1.5rem,4.2vw,2.6rem)] leading-[0.95] font-extrabold tracking-tight">{shortName(product)}</span>
      <span className="text-sm font-semibold opacity-80">{product.brand}</span>
    </div>
  )
}

export function GiaSanPham({ product, big }: { product: ThongTinSanPham; big?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cx('font-bold text-brand', big ? 'text-3xl' : 'text-lg')}>{tienVND(product.price)}</span>
      {product.oldPrice && <span className="text-sm text-muted line-through">{tienVND(product.oldPrice)}</span>}
    </div>
  )
}

export function GhiChuTonKho({ id, className }: { id: string; className?: string }) {
  const n = tonKho[id] ?? 0
  if (n === 0) return <span className={cx('text-sm font-semibold text-danger', className)}>Hết hàng</span>
  if (n < 5) return <span className={cx('text-sm font-semibold text-warn', className)}>Chỉ còn {n} sản phẩm</span>
  return <span className={cx('text-sm font-semibold text-ok', className)}>Còn hàng</span>
}

export function TheSanPham({ product }: { product: ThongTinSanPham }) {
  const off = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-surface transition-transform duration-200 hover:-translate-y-1">
      <Link to={`/san-pham/${product.id}`} className="relative block">
        <AnhSanPham product={product} />
        {off > 0 && <span className="absolute top-3 right-3 rounded bg-danger px-2 py-0.5 text-[13px] font-bold text-white">-{off}%</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/san-pham/${product.id}`} className="line-clamp-2 min-h-[3rem] text-[15px] leading-snug font-semibold hover:text-brand">
          {product.name}
        </Link>
        <GiaSanPham product={product} />
        <GhiChuTonKho id={product.id} />
        <button type="button" className="mt-auto h-10 rounded-md bg-white text-sm font-semibold transition-colors hover:bg-brand hover:text-white">
          Thêm vào giỏ
        </button>
      </div>
    </article>
  )
}
