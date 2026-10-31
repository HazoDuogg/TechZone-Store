import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { cx } from '../lib/lopCss'

type Anh = { id: string; ten: string; url: string }

type Props = {
  label: string
  hint?: string
  multiple?: boolean
  max?: number
  className?: string
}

export default function VungTaiAnh({ label, hint, multiple, max = 1, className }: Props) {
  const [dsAnh, setDsAnh] = useState<Anh[]>([])
  const urls = useRef<string[]>([])

  useEffect(() => {
    const giu = urls.current
    return () => giu.forEach((u) => URL.revokeObjectURL(u))
  }, [])

  const chon = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    const moi = files.map((f) => {
      const url = URL.createObjectURL(f)
      urls.current.push(url)
      return { id: `${f.name}-${url}`, ten: f.name, url }
    })
    setDsAnh((cu) => (multiple ? [...cu, ...moi].slice(0, max) : moi.slice(0, 1)))
  }

  const xoa = (id: string) => setDsAnh((cu) => cu.filter((a) => a.id !== id))
  const datAnhChinh = (id: string) =>
    setDsAnh((cu) => {
      const a = cu.find((x) => x.id === id)
      return a ? [a, ...cu.filter((x) => x.id !== id)] : cu
    })

  const day = dsAnh.length >= max

  return (
    <div className={className}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <div className="rounded-lg border-2 border-dashed border-surface-2 p-3">
        {dsAnh.length > 0 && (
          <ul className={cx('mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4')}>
            {dsAnh.map((a, i) => (
              <li key={a.id} className="min-w-0">
                <div className="relative aspect-square overflow-hidden rounded-md bg-surface">
                  <img src={a.url} alt={a.ten} className="h-full w-full object-cover" />
                  {multiple && i === 0 && (
                    <span className="absolute top-1 left-1 rounded bg-brand px-1.5 py-0.5 text-xs font-semibold text-white">Ảnh chính</span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-3 text-sm">
                  {multiple && i > 0 && (
                    <button type="button" onClick={() => datAnhChinh(a.id)} className="font-semibold text-brand hover:underline">Làm ảnh chính</button>
                  )}
                  <button type="button" onClick={() => xoa(a.id)} className="font-semibold text-danger hover:underline">Xóa</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <label
          className={cx(
            'flex min-h-20 flex-col items-center justify-center rounded-md bg-surface px-4 py-4 text-center transition-colors focus-within:outline-2 focus-within:outline-brand',
            day ? 'opacity-50' : 'hover:bg-surface-2'
          )}
        >
          <input type="file" accept="image/webp,image/jpeg,image/png" multiple={multiple} disabled={day} onChange={chon} className="sr-only" />
          <span className="font-semibold">{day ? 'Đã đủ số ảnh' : multiple ? 'Chọn ảnh từ máy' : dsAnh.length ? 'Đổi ảnh khác' : 'Chọn ảnh từ máy'}</span>
          <span className="mt-0.5 text-sm text-muted">{multiple ? `Đã chọn ${dsAnh.length}/${max} ảnh` : 'Một ảnh'}</span>
        </label>
      </div>
      {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
    </div>
  )
}
