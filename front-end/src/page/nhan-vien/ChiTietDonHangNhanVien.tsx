import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TieuDeTrang } from '../../components/BoCuc'
import { NoiDungDonHang } from '../../components/HienThiDonHang'
import { Nut, TrangTrong, HopThoai } from '../../components/GiaoDienCoBan'
import { dsDonHang } from '../../data/duLieuMau'
import { useGocQuanLy } from '../../lib/gocQuanLy'

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
