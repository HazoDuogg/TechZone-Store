import type { ReactNode } from 'react'
import { mucTrongGio } from '../lib/gioHang'
import { tienVND } from '../lib/dinhDang'

export default function TomTatDonHang({ cta }: { cta?: ReactNode }) {
  const subtotal = mucTrongGio.reduce((s, i) => s + i.product.price * i.qty, 0)
  return (
    <aside className="h-fit rounded-xl bg-surface p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold">Tóm tắt đơn hàng</h2>
      <dl className="mt-4 space-y-2 text-[15px]">
        <div className="flex justify-between"><dt className="text-muted">Tạm tính</dt><dd>{tienVND(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Giảm giá</dt><dd className="text-ok">{tienVND(0)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Vận chuyển</dt><dd>Miễn phí</dd></div>
      </dl>
      <div className="mt-4 flex items-baseline justify-between pt-4 text-lg font-bold shadow-[0_-1px_0_var(--color-surface-2)]">
        <span>Tổng cộng</span>
        <span className="text-2xl text-brand">{tienVND(subtotal)}</span>
      </div>
      {cta && <div className="mt-5">{cta}</div>}
    </aside>
  )
}
