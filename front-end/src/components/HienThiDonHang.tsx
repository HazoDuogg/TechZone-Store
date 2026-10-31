import { Link } from 'react-router-dom'
import { CAC_BUOC_DON, type ThongTinDonHang } from '../data/duLieuMau'
import { cx } from '../lib/lopCss'
import { ngayGioVN, tienVND, tamTinhDon, timSanPham } from '../lib/dinhDang'
import { NhanTrangThai } from './GiaoDienCoBan'

export function TienTrinhDon({ status }: { status: ThongTinDonHang['status'] }) {
  if (status === 'Đã hủy') return <div className="rounded-lg bg-danger/10 px-4 py-3 font-semibold text-danger">Đơn hàng đã được hủy</div>
  const at = CAC_BUOC_DON.indexOf(status)
  return (
    <ol className="grid grid-cols-4 gap-2">
      {CAC_BUOC_DON.map((s, i) => (
        <li key={s} className="text-center">
          <div className={cx('h-2 rounded-full', i <= at ? 'bg-brand' : 'bg-surface-2')} />
          <div className={cx('mt-2 text-[13px] leading-tight sm:text-sm', i <= at ? 'font-semibold text-ink' : 'text-muted')}>{s}</div>
        </li>
      ))}
    </ol>
  )
}

export function NoiDungDonHang({ order, staff }: { order: ThongTinDonHang; staff?: boolean }) {
  const sub = tamTinhDon(order)
  const total = sub - order.discount + order.shipping
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm text-muted">Mã đơn hàng</div>
            <div className="text-xl font-extrabold">{order.code}</div>
          </div>
          <NhanTrangThai status={order.status} />
        </div>
        <TienTrinhDon status={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl bg-surface p-5 sm:p-6">
          <h2 className="mb-3 font-bold">Thông tin nhận hàng</h2>
          <dl className="space-y-1.5 text-[15px]">
            <div><dt className="inline text-muted">Người nhận: </dt><dd className="inline font-medium">{order.customer}</dd></div>
            <div><dt className="inline text-muted">Điện thoại: </dt><dd className="inline font-medium">{order.phone}</dd></div>
            {staff && order.email && <div><dt className="inline text-muted">Email: </dt><dd className="inline font-medium">{order.email}</dd></div>}
            <div><dt className="inline text-muted">Địa chỉ: </dt><dd className="inline font-medium">{order.address}</dd></div>
          </dl>
        </section>
        <section className="rounded-xl bg-surface p-5 sm:p-6">
          <h2 className="mb-3 font-bold">Thanh toán</h2>
          <dl className="space-y-1.5 text-[15px]">
            <div><dt className="inline text-muted">Phương thức: </dt><dd className="inline font-medium">{order.payment}</dd></div>
            <div><dt className="inline text-muted">Ngày đặt: </dt><dd className="inline font-medium">{ngayGioVN(order.createdAt)}</dd></div>
          </dl>
        </section>
      </div>

      <section className="rounded-xl bg-surface p-5 sm:p-6">
        <h2 className="mb-3 font-bold">Sản phẩm</h2>
        <ul className="space-y-3">
          {order.items.map((i) => {
            const p = timSanPham(i.id)
            return (
              <li key={i.id} className="flex items-start justify-between gap-4 text-[15px]">
                {p ? <Link to={`/san-pham/${p.id}`} className="font-medium hover:text-brand">{p.name} <span className="text-muted">× {i.qty}</span></Link> : <span>Sản phẩm đã ngừng bán × {i.qty}</span>}
                <span className="font-semibold whitespace-nowrap">{tienVND((p?.price ?? 0) * i.qty)}</span>
              </li>
            )
          })}
        </ul>
        <dl className="mt-5 space-y-1.5 border-t border-surface-2 pt-4 text-[15px]">
          <div className="flex justify-between"><dt className="text-muted">Tạm tính</dt><dd>{tienVND(sub)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Giảm giá</dt><dd>{order.discount ? '−' + tienVND(order.discount) : tienVND(0)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Vận chuyển</dt><dd>{order.shipping ? tienVND(order.shipping) : 'Miễn phí'}</dd></div>
          <div className="flex justify-between pt-2 text-lg font-bold"><dt>Tổng cộng</dt><dd className="text-brand">{tienVND(total)}</dd></div>
        </dl>
      </section>
    </div>
  )
}
