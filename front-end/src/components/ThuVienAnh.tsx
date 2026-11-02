import { useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent } from 'react'
import type { ThongTinSanPham } from '../data/duLieuMau'
import { duongDanAnhSanPham, SO_GOC_ANH } from '../lib/duongDanAnh'
import { cx } from '../lib/lopCss'
import { KhungSanPham } from './SanPham'

const dsGoc = Array.from({ length: SO_GOC_ANH }, (_, i) => i + 1)

export default function ThuVienAnh({ product }: { product: ThongTinSanPham }) {
  const [cur, setCur] = useState(0)
  const [loi, setLoi] = useState<number[]>([])
  const xBatDau = useRef<number | null>(null)

  const di = (buoc: number) => setCur((c) => (c + buoc + SO_GOC_ANH) % SO_GOC_ANH)
  const danhDauLoi = (n: number) => setLoi((l) => (l.includes(n) ? l : [...l, n]))

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') di(-1)
    if (e.key === 'ArrowRight') di(1)
  }
  const onTouchStart = (e: TouchEvent) => {
    xBatDau.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: TouchEvent) => {
    if (xBatDau.current === null) return
    const dx = e.changedTouches[0].clientX - xBatDau.current
    xBatDau.current = null
    if (Math.abs(dx) > 40) di(dx < 0 ? 1 : -1)
  }

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Ảnh sản phẩm" onKeyDown={onKey}>
      <div className="relative overflow-hidden rounded-xl bg-surface" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${cur * 100}%)` }}>
          {dsGoc.map((n) => (
            <div key={n} className="aspect-square w-full shrink-0" aria-hidden={n !== cur + 1}>
              {loi.includes(n) ? (
                <KhungSanPham product={product} className="h-full w-full p-8 sm:p-12 [&_span:nth-child(2)]:text-[clamp(3rem,10vw,6rem)]" />
              ) : (
                <img
                  src={duongDanAnhSanPham(product, n)}
                  alt={`${product.name}, góc ${n}`}
                  loading={n === 1 ? 'eager' : 'lazy'}
                  onError={() => danhDauLoi(n)}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => di(-1)}
          aria-label="Ảnh trước"
          className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl leading-none hover:bg-white"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => di(1)}
          aria-label="Ảnh sau"
          className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl leading-none hover:bg-white"
        >
          ›
        </button>
        <span className="absolute right-3 bottom-3 rounded bg-ink/70 px-2 py-0.5 text-sm font-semibold text-white" aria-live="polite">
          {cur + 1} / {SO_GOC_ANH}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {dsGoc.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setCur(n - 1)}
            aria-label={`Xem ảnh ${n}`}
            aria-current={n === cur + 1}
            className={cx('aspect-square overflow-hidden rounded-lg bg-surface ring-2 transition-shadow', n === cur + 1 ? 'ring-brand' : 'ring-transparent hover:ring-surface-2')}
          >
            {loi.includes(n) ? (
              <span className="grid h-full w-full place-items-center bg-surface-2 text-sm font-semibold text-muted">{n}</span>
            ) : (
              <img src={duongDanAnhSanPham(product, n)} alt="" loading="lazy" onError={() => danhDauLoi(n)} className="h-full w-full object-contain" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
