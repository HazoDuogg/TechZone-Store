import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { cx } from '../lib/lopCss'
import { boDau } from '../lib/dinhDang'

export type LuaChon = { value: string; label: string; hint?: string }

type Props = {
  label: string
  options: LuaChon[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  emptyText?: string
  hint?: string
  className?: string
}

export default function OChonTimKiem({ label, options, value, onChange, placeholder = 'Gõ để tìm', emptyText = 'Không có lựa chọn phù hợp', hint, className }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const id = useId()

  const chon = options.find((o) => o.value === value)
  const q = boDau(query.trim())
  const ds = q ? options.filter((o) => boDau(`${o.label} ${o.hint ?? ''}`).includes(q)) : options

  const pick = (o: LuaChon) => {
    onChange(o.value)
    setOpen(false)
    setQuery('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, ds.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (open) e.preventDefault()
      if (open && ds[active]) pick(ds[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className={cx('relative', className)}>
      <label htmlFor={`${id}-input`} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="relative">
        <input
          id={`${id}-input`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && ds[active] ? `${id}-${active}` : undefined}
          autoComplete="off"
          placeholder={placeholder}
          value={open ? query : chon?.label ?? ''}
          onFocus={() => { setOpen(true); setQuery(''); setActive(0) }}
          onClick={() => { if (!open) { setOpen(true); setQuery(''); setActive(0) } }}
          onBlur={() => setOpen(false)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0) }}
          onKeyDown={onKeyDown}
          className="h-11 w-full rounded-md border border-surface-2 bg-white px-3 pr-9 text-[15px] text-ink placeholder:text-muted/70 focus:outline-2 focus:outline-brand"
        />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-muted">▾</span>
      </div>
      {open && (
        <ul id={`${id}-list`} role="listbox" className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-surface-2 bg-white p-1 shadow-lg">
          {ds.length === 0 && <li className="px-3 py-2 text-sm text-muted">{emptyText}</li>}
          {ds.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={o.value === value}
              onMouseDown={(e) => { e.preventDefault(); pick(o) }}
              onMouseEnter={() => setActive(i)}
              className={cx('cursor-pointer rounded-md px-3 py-2', i === active && 'bg-brand-soft', o.value === value && 'font-semibold')}
            >
              <div className="text-[15px]">{o.label}</div>
              {o.hint && <div className="text-sm text-muted">{o.hint}</div>}
            </li>
          ))}
        </ul>
      )}
      {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
    </div>
  )
}
