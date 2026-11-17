import type { ReactNode } from 'react'
import { tienVND } from '../lib/dinhDang'
import { useGioHang } from '../store/gioHang'

export default function TomTatDonHang({ cta }: { cta?: ReactNode }) {
  const cacMuc = useGioHang((s) => s.cacMuc)
  const tamTinh = cacMuc.reduce((s, i) => s + i.sanPham.gia * i.soLuong, 0)

  return (
    <aside className="h-fit rounded-xl bg-surface p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold">Tóm tắt đơn hàng</h2>
      <div className="mt-4 flex items-baseline justify-between text-lg font-bold">
        <span>Tạm tính</span>
        <span className="text-2xl text-brand">{tienVND(tamTinh)}</span>
      </div>
      <p className="mt-3 text-sm text-muted">Phí vận chuyển và mã giảm giá được tính khi đặt hàng.</p>
      {cta && <div className="mt-5">{cta}</div>}
    </aside>
  )
}
