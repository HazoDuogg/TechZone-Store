import { useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent } from 'react'
import type { ThongTinSanPham } from '../types'
import { duongDanAnhSanPham, SO_GOC_ANH } from '../lib/duongDanAnh'
import { cx } from '../lib/lopCss'
import { KhungSanPham } from './SanPham'

const CAC_GOC = Array.from({ length: SO_GOC_ANH }, (_, viTri) => viTri + 1)

export default function ThuVienAnh({ product }: { product: ThongTinSanPham }) {
  const [gocDangXem, setGocDangXem] = useState(0)
  const [gocLoi, setGocLoi] = useState<number[]>([])
  const xBatDau = useRef<number | null>(null)

  const chuyenAnh = (buoc: number) => setGocDangXem((hienTai) => (hienTai + buoc + SO_GOC_ANH) % SO_GOC_ANH)
  const danhDauLoi = (goc: number) => setGocLoi((truoc) => (truoc.includes(goc) ? truoc : [...truoc, goc]))

  const khiNhanPhim = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') chuyenAnh(-1)
    if (e.key === 'ArrowRight') chuyenAnh(1)
  }
  const khiChamBatDau = (e: TouchEvent) => {
    xBatDau.current = e.touches[0].clientX
  }
  const khiChamKetThuc = (e: TouchEvent) => {
    if (xBatDau.current === null) return
    const doDich = e.changedTouches[0].clientX - xBatDau.current
    xBatDau.current = null
    if (Math.abs(doDich) > 40) chuyenAnh(doDich < 0 ? 1 : -1)
  }

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Ảnh sản phẩm" onKeyDown={khiNhanPhim}>
      <div className="relative overflow-hidden rounded-xl bg-surface" onTouchStart={khiChamBatDau} onTouchEnd={khiChamKetThuc}>
        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${gocDangXem * 100}%)` }}>
          {CAC_GOC.map((goc) => (
            <div key={goc} className="aspect-square w-full shrink-0" aria-hidden={goc !== gocDangXem + 1}>
              {gocLoi.includes(goc) ? (
                <KhungSanPham product={product} className="h-full w-full p-8 sm:p-12 [&_span:nth-child(2)]:text-[clamp(3rem,10vw,6rem)]" />
              ) : (
                <img
                  src={duongDanAnhSanPham(product, goc)}
                  alt={`${product.name}, góc ${goc}`}
                  loading={goc === 1 ? 'eager' : 'lazy'}
                  onError={() => danhDauLoi(goc)}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => chuyenAnh(-1)}
          aria-label="Ảnh trước"
          className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl leading-none hover:bg-white"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => chuyenAnh(1)}
          aria-label="Ảnh sau"
          className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl leading-none hover:bg-white"
        >
          ›
        </button>
        <span className="absolute right-3 bottom-3 rounded bg-ink/70 px-2 py-0.5 text-sm font-semibold text-white" aria-live="polite">
          {gocDangXem + 1} / {SO_GOC_ANH}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {CAC_GOC.map((goc) => (
          <button
            key={goc}
            type="button"
            onClick={() => setGocDangXem(goc - 1)}
            aria-label={`Xem ảnh ${goc}`}
            aria-current={goc === gocDangXem + 1}
            className={cx(
              'aspect-square overflow-hidden rounded-lg bg-surface ring-2 transition-shadow',
              goc === gocDangXem + 1 ? 'ring-brand' : 'ring-transparent hover:ring-surface-2',
            )}
          >
            {gocLoi.includes(goc) ? (
              <span className="grid h-full w-full place-items-center bg-surface-2 text-sm font-semibold text-muted">{goc}</span>
            ) : (
              <img src={duongDanAnhSanPham(product, goc)} alt="" loading="lazy" onError={() => danhDauLoi(goc)} className="h-full w-full object-contain" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
