import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TieuDeTrang } from '../../components/BoCuc'
import { NoiDungDonHang } from '../../components/HienThiDonHang'
import { Nut, TrangTrong, HopThoai, TruongNhap } from '../../components/GiaoDienCoBan'
import { dsDonHang, type ThongTinDonHang } from '../../data/duLieuMau'
import { timSanPham } from '../../lib/dinhDang'
import { useGocQuanLy } from '../../lib/gocQuanLy'

function GanSerial({ items }: { items: ThongTinDonHang['items'] }) {
  return (
    <section className="mt-6 rounded-xl bg-white p-5" aria-labelledby="serial">
      <h2 id="serial" className="font-bold">Số serial từng chiếc</h2>
      <p className="mt-1 text-sm text-muted">Nhập serial của từng chiếc giao cho khách để tra cứu bảo hành về sau.</p>
      <div className="mt-4 space-y-5">
        {items.map((it) => (
          <div key={it.id}>
            <div className="mb-2 font-semibold">{timSanPham(it.id)?.name} <span className="font-normal text-muted">× {it.qty}</span></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: it.qty }, (_, k) => (
                <TruongNhap key={k} label={`Chiếc ${k + 1}`} placeholder="Ví dụ: SN-RTX4060-77120" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5"><Nut>Lưu serial</Nut></div>
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
