import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { cx } from '../lib/lopCss'
import api from '../lib/api'
import { anhTheoDuongDan } from '../lib/duongDanAnh'
import { layThongBaoLoi } from '../lib/thongBaoLoi'

const DUNG_LUONG_TOI_DA = 2 * 1024 * 1024

type Props = {
  label: string
  hint?: string
  value: string[]
  onChange: (duongDan: string[]) => void
  multiple?: boolean
  max?: number
  className?: string
}

export default function VungTaiAnh({ label, hint, value, onChange, multiple, max = 1, className }: Props) {
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const day = multiple && value.length >= max

  async function chon(e: ChangeEvent<HTMLInputElement>) {
    const cacTep = Array.from(e.target.files ?? []).slice(0, multiple ? max - value.length : 1)
    e.target.value = ''

    const tepQuaLon = cacTep.find((tep) => tep.size > DUNG_LUONG_TOI_DA)
    if (tepQuaLon) {
      setLoi(`"${tepQuaLon.name}" lớn hơn 2MB`)
      return
    }

    setDangTai(true)
    setLoi(null)
    const daTai: string[] = []
    try {
      for (const tep of cacTep) {
        const form = new FormData()
        form.append('file', tep)
        const res = await api.post<{ duongDan: string }>('/tai-anh', form)
        daTai.push(res.data.duongDan)
      }
    } catch (err) {
      setLoi(layThongBaoLoi(err, 'Không tải được ảnh'))
    } finally {
      setDangTai(false)
    }
    if (daTai.length > 0) onChange(multiple ? [...value, ...daTai] : daTai)
  }

  const xoa = (duongDan: string) => onChange(value.filter((d) => d !== duongDan))
  const datAnhChinh = (duongDan: string) => onChange([duongDan, ...value.filter((d) => d !== duongDan)])

  return (
    <div className={className}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <div className="rounded-lg border-2 border-dashed border-surface-2 p-3">
        {value.length > 0 && (
          <ul className={cx('mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4')}>
            {value.map((duongDan, i) => (
              <li key={duongDan} className="min-w-0">
                <div className="relative aspect-square overflow-hidden rounded-md bg-surface">
                  <img src={anhTheoDuongDan(duongDan)} alt="" className="h-full w-full object-cover" />
                  {multiple && i === 0 && <span className="absolute top-1 left-1 rounded bg-brand px-1.5 py-0.5 text-xs font-semibold text-white">Ảnh chính</span>}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-3 text-sm">
                  {multiple && i > 0 && (
                    <button type="button" onClick={() => datAnhChinh(duongDan)} className="font-semibold text-brand hover:underline">
                      Làm ảnh chính
                    </button>
                  )}
                  <button type="button" onClick={() => xoa(duongDan)} className="font-semibold text-danger hover:underline">
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <label
          className={cx(
            'flex min-h-20 flex-col items-center justify-center rounded-md bg-surface px-4 py-4 text-center transition-colors focus-within:outline-2 focus-within:outline-brand',
            day || dangTai ? 'opacity-50' : 'hover:bg-surface-2',
          )}
        >
          <input type="file" accept="image/webp,image/jpeg,image/png" multiple={multiple} disabled={day || dangTai} onChange={chon} className="sr-only" />
          <span className="font-semibold">
            {dangTai ? 'Đang tải ảnh...' : day ? 'Đã đủ số ảnh' : multiple ? 'Chọn ảnh từ máy' : value.length ? 'Đổi ảnh khác' : 'Chọn ảnh từ máy'}
          </span>
          <span className="mt-0.5 text-sm text-muted">{multiple ? `Đã chọn ${value.length}/${max} ảnh` : 'Một ảnh'}</span>
        </label>
      </div>
      {loi && <span className="mt-1 block text-sm font-semibold text-danger">{loi}</span>}
      {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
    </div>
  )
}
