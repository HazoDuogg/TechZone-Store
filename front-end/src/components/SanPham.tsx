import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SanPham } from '../types'
import { duongDanAnhSanPham } from '../lib/duongDanAnh'
import { cx } from '../lib/lopCss'
import { tienVND } from '../lib/dinhDang'
import { useGioHang } from '../store/gioHang'
import { useThongBao } from '../store/thongBao'

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

const shortName = (p: SanPham) => {
  const m = p.ten.match(/(Ryzen \d \w+|i\d-\w+|RTX \d+\s?\w*|RX \d+|B\d{3}\w*|Z\d{3}|H\d{3}|DDR\d [\d]+|\d+(GB|TB)|\d+W|G\d+|H5|DeathAdder V3|\d+")/i)
  return m ? m[0] : (p.thuongHieu ?? '')
}

export function AnhSanPham({ product, className }: { product: SanPham; className?: string }) {
  const [loi, setLoi] = useState(false)
  if (loi) return <KhungSanPham product={product} className={className} />
  return (
    <div className={cx('flex aspect-square items-center justify-center overflow-hidden bg-white', className)}>
      <img
        src={duongDanAnhSanPham(product, 1)}
        onError={(e) => {
          const img = e.currentTarget
          const duongDanPng = duongDanAnhSanPham(product, 1, 'png')
          if (img.src.endsWith('.webp') && img.src !== duongDanPng) {
            img.src = duongDanPng
          } else {
            setLoi(true)
          }
        }}
        alt={product.ten}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </div>
  )
}

export function KhungSanPham({ product, className }: { product: SanPham; className?: string }) {
  return (
    <div className={cx('flex aspect-square flex-col justify-between p-5', tints[product.danhMuc.ten] ?? 'bg-surface', className)} aria-hidden="true">
      <span className="text-sm font-semibold opacity-80">{product.danhMuc.ten}</span>
      <span className="text-[clamp(1.5rem,4.2vw,2.6rem)] leading-[0.95] font-extrabold tracking-tight">{shortName(product)}</span>
      <span className="text-sm font-semibold opacity-80">{product.thuongHieu}</span>
    </div>
  )
}

export function GiaSanPham({ product, big }: { product: SanPham; big?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cx('font-bold text-brand', big ? 'text-3xl' : 'text-lg')}>{tienVND(product.gia)}</span>
      {product.giaNiemYet && <span className="text-sm text-muted line-through">{tienVND(product.giaNiemYet)}</span>}
    </div>
  )
}

export function GhiChuTonKho({ soLuong, className }: { soLuong: number; className?: string }) {
  if (soLuong === 0) return <span className={cx('text-sm font-semibold text-danger', className)}>Hết hàng</span>
  if (soLuong < 5) return <span className={cx('text-sm font-semibold text-warn', className)}>Chỉ còn {soLuong} sản phẩm</span>
  return <span className={cx('text-sm font-semibold text-ok', className)}>Còn hàng</span>
}

export function TheSanPham({ product }: { product: SanPham }) {
  const off = product.giaNiemYet ? Math.round((1 - product.gia / product.giaNiemYet) * 100) : 0
  const them = useGioHang((s) => s.them)
  const thongBao = useThongBao((s) => s.hien)

  function themVaoGio() {
    them(product)
    thongBao('Đã thêm vào giỏ hàng', product.ten)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-surface transition-transform duration-200 hover:-translate-y-1">
      <Link to={`/san-pham/${product.id}`} className="relative block">
        <AnhSanPham product={product} />
        {off > 0 && <span className="absolute top-3 right-3 rounded bg-danger px-2 py-0.5 text-[13px] font-bold text-white">-{off}%</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/san-pham/${product.id}`} className="line-clamp-2 min-h-[3rem] text-[15px] leading-snug font-semibold hover:text-brand">
          {product.ten}
        </Link>
        <GiaSanPham product={product} />
        <GhiChuTonKho soLuong={product.tonKho} />
        <button
          type="button"
          className="mt-auto h-10 rounded-md bg-white text-sm font-semibold transition-colors hover:bg-brand hover:text-white disabled:pointer-events-none disabled:opacity-50"
          onClick={themVaoGio}
          disabled={product.tonKho === 0}
        >
          Thêm vào giỏ
        </button>
      </div>
    </article>
  )
}
