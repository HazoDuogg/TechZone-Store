import { useEffect } from 'react'
import { useThongBao } from '../store/thongBao'

const THOI_GIAN_HIEN = 4000

export default function ThongBao() {
  const thongBao = useThongBao((s) => s.thongBao)
  const an = useThongBao((s) => s.an)

  useEffect(() => {
    if (!thongBao) return
    const hen = setTimeout(an, THOI_GIAN_HIEN)
    return () => clearTimeout(hen)
  }, [thongBao, an])

  if (!thongBao) return null

  return (
    <div className="pointer-events-none fixed inset-x-4 top-20 z-50 flex justify-end sm:inset-x-6">
      <div
        key={thongBao.id}
        role="status"
        aria-live="polite"
        className="truot-vao pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/10"
      >
        <div className="flex items-start gap-3 p-4">
          <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ok/10 text-lg font-bold text-ok">
            ✓
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{thongBao.tieuDe}</p>
            {thongBao.noiDung && <p className="mt-0.5 text-sm text-muted">{thongBao.noiDung}</p>}
          </div>
          <button
            type="button"
            onClick={an}
            aria-label="Đóng thông báo"
            className="-mt-1 -mr-1 rounded-md px-2 py-1 text-xl leading-none text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            ×
          </button>
        </div>
        <div className="h-1 bg-surface">
          <div className="thanh-dem h-full bg-brand" style={{ animationDuration: `${THOI_GIAN_HIEN}ms` }} />
        </div>
      </div>
    </div>
  )
}
