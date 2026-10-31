import { useEffect } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cx } from '../lib/lopCss'

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  dark: 'bg-ink text-white hover:bg-black',
  soft: 'bg-surface text-ink hover:bg-surface-2',
  danger: 'bg-danger/10 text-danger hover:bg-danger/20',
}
const sizes = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-5 text-[15px]', lg: 'h-13 px-7 text-base' }

type Look = { variant?: keyof typeof variants; size?: keyof typeof sizes }

const btnClass = ({ variant = 'primary', size = 'md' }: Look, extra?: string) =>
  cx(
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    extra
  )

export function Nut({ variant, size, className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & Look) {
  return <button {...p} className={btnClass({ variant, size }, className)} />
}

export function NutLienKet({ variant, size, className, ...p }: LinkProps & Look) {
  return <Link {...p} className={btnClass({ variant, size }, className)} />
}

const control =
  'w-full rounded-md bg-surface px-3 text-[15px] text-ink placeholder:text-muted/70 transition-colors focus:bg-white focus:outline-2 focus:outline-brand'

export function TruongNhap({
  label,
  hint,
  className,
  ...p
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input {...p} className={cx(control, 'h-11 border border-surface-2 bg-white')} />
      {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
    </label>
  )
}

export function VungNhap({ label, className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <textarea {...p} className={cx(control, 'py-2.5 min-h-24')} />
    </label>
  )
}

export function OChon({
  label,
  className,
  children,
  ...p
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className={cx('block', className)}>
      {label && <span className="mb-1.5 block text-sm font-semibold">{label}</span>}
      <select {...p} className={cx(control, 'h-11')}>
        {children}
      </select>
    </label>
  )
}

const tones = {
  gray: 'bg-surface-2 text-ink',
  blue: 'bg-brand-soft text-brand-dark',
  green: 'bg-ok/12 text-ok',
  amber: 'bg-warn/12 text-warn',
  red: 'bg-danger/12 text-danger',
}

export function Nhan({ tone = 'gray', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={cx('inline-block rounded px-2 py-0.5 text-[13px] font-semibold whitespace-nowrap', tones[tone])}>{children}</span>
}

const statusTone: Record<string, keyof typeof tones> = {
  'Chờ xác nhận': 'amber',
  'Đã xác nhận': 'blue',
  'Đang giao': 'blue',
  'Hoàn tất': 'green',
  'Đã hủy': 'red',
  'Tiếp nhận': 'gray',
  'Đang kiểm tra': 'blue',
  'Đang sửa': 'blue',
  'Chờ linh kiện': 'amber',
  'Từ chối': 'red',
}

export const NhanTrangThai = ({ status }: { status: string }) => <Nhan tone={statusTone[status] ?? 'gray'}>{status}</Nhan>

export function HopThoai({
  title,
  onClose,
  children,
  wide,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={cx('rise max-h-[92vh] w-full overflow-y-auto rounded-t-xl bg-white p-6 shadow-2xl sm:rounded-xl', wide ? 'max-w-2xl' : 'max-w-lg')}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Đóng" className="-m-2 rounded-md p-2 text-2xl leading-none text-muted hover:bg-surface">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function TrangTrong({ children }: { children: ReactNode }) {
  return <div className="rounded-lg bg-surface px-6 py-14 text-center text-muted">{children}</div>
}

export function ThanhTab<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: readonly T[] }) {
  return (
    <div role="tablist" className="inline-flex flex-wrap gap-1 rounded-lg bg-surface p-1">
      {items.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={value === t}
          onClick={() => onChange(t)}
          className={cx(
            'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
            value === t ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
