import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TieuDeTrang } from '../../components/BoCuc'
import { NoiDungDonHang } from '../../components/HienThiDonHang'
import { Nhan, Nut, TrangTrong, HopThoai, TruongNhap } from '../../components/GiaoDienCoBan'
import { dsDonHang, type ThongTinDonHang } from '../../data/duLieuMau'
import { cx } from '../../lib/lopCss'
import { timSanPham } from '../../lib/dinhDang'
import { useGocQuanLy } from '../../lib/gocQuanLy'

function GanSerial({ items }: { items: ThongTinDonHang['items'] }) {
  const [edit, setEdit] = useState(false)
  const chuanHoa = () => items.map((it) => ({ ...it, serials: Array.from({ length: it.qty }, (_, k) => it.serials[k] ?? '') }))
  const [daLuu, setDaLuu] = useState(chuanHoa)
  const [dsItems, setDsItems] = useState(daLuu)

  const capNhatSerial = (id: string, index: number, serial: string) =>
    setDsItems((d) =>
      d.map((it) =>
        it.id === id ? { ...it, serials: it.serials.map((s, k) => (k === index ? serial : s)) } : it))

  const daDoi = JSON.stringify(dsItems) !== JSON.stringify(daLuu)
  const huy = () => { setDsItems(daLuu); setEdit(false) }
  const luu = () => { setDaLuu(dsItems); setEdit(false) }

  return (
    <section className={cx('mt-6 rounded-xl bg-white p-5', edit && 'ring-2 ring-brand/30')} aria-labelledby="serial">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="serial" className="flex flex-wrap items-center gap-2 font-bold">
            Số serial từng chiếc
            {edit && <Nhan tone="blue">Đang chỉnh sửa</Nhan>}
          </h2>
          <p className="mt-1 text-sm text-muted">Serial được hệ thống chọn khi xác nhận đơn. Đổi nếu chiếc đó không còn hoặc lấy nhầm.</p>
        </div>
        <div className="flex gap-2">
          {edit ? (
            <>
              <Nut size="sm" variant="soft" onClick={huy}>Hủy</Nut>
              <Nut size="sm" disabled={!daDoi} onClick={luu}>Lưu</Nut>
            </>
          ) : (
            <Nut size="sm" variant="soft" onClick={() => setEdit(true)}>Đổi serial</Nut>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-5">
        {dsItems.map((it) => (
          <div key={it.id}>
            <div className="mb-2 font-semibold">{timSanPham(it.id)?.name} <span className="font-normal text-muted">× {it.qty}</span></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {it.serials.map((s, k) => (
                <TruongNhap
                  key={k}
                  label={`Chiếc ${k + 1}`}
                  value={s}
                  onChange={(e) => capNhatSerial(it.id, k, e.currentTarget.value)}
                  disabled={!edit} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ChiTietDonHangNhanVien() {
  const { code } = useParams()
  const goc = useGocQuanLy()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const order = dsDonHang.find((o) => o.code === code)

  if (!order) return <TrangTrong>Không tìm thấy đơn hàng. <Link to={`${goc}/don-hang`} className="font-semibold text-brand">Quay lại danh sách</Link></TrangTrong>

  return (
    <>
      <Link to={`${goc}/don-hang`} className="text-sm font-semibold text-brand hover:underline">← Danh sách đơn</Link>
      <TieuDeTrang
        title={`Đơn ${order.code}`}
        desc={order.payment === 'COD' ? 'Đơn thanh toán khi nhận hàng. Gọi xác nhận với khách trước khi chuyển trạng thái.' : undefined}
        action={
          <div className="flex gap-2">
            <Nut variant="danger" onClick={() => setConfirmCancel(true)}>Hủy đơn</Nut>
            <Nut>Xác nhận đơn</Nut>
          </div>
        }
      />
      <NoiDungDonHang order={order} staff />
      {['Đã xác nhận', 'Đang giao', 'Hoàn tất'].includes(order.status) && <GanSerial items={order.items} />}

      {confirmCancel && (
        <HopThoai title="Hủy đơn hàng" onClose={() => setConfirmCancel(false)}>
          <p>Bạn chắc chắn muốn hủy đơn <b>{order.code}</b> của {order.customer}?</p>
          <div className="mt-6 flex justify-end gap-2">
            <Nut variant="soft" onClick={() => setConfirmCancel(false)}>Giữ đơn</Nut>
            <Nut variant="danger" onClick={() => setConfirmCancel(false)}>Hủy đơn</Nut>
          </div>
        </HopThoai>
      )}
    </>
  )
}
