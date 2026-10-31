import { Link, useParams } from 'react-router-dom'
import { Nut, TrangTrong } from '../../components/GiaoDienCoBan'
import { NoiDungDonHang } from '../../components/HienThiDonHang'
import { dsDonHang } from '../../data/duLieuMau'

export default function ChiTietDonHang() {
  const { code } = useParams()
  const order = dsDonHang.find((o) => o.code === code)

  if (!order)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <TrangTrong>
          Không tìm thấy đơn hàng. <Link to="/don-hang" className="font-semibold text-brand">Tra cứu lại</Link>
        </TrangTrong>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link to="/don-hang" className="text-sm font-semibold text-brand hover:underline">← Đơn hàng</Link>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold tracking-tight">Chi tiết đơn hàng</h1>
      <NoiDungDonHang order={order} />
      {order.status === 'Chờ xác nhận' && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Nut variant="danger">Hủy đơn hàng</Nut>
          <span className="text-sm text-muted">Chỉ hủy được khi đơn chưa được xác nhận.</span>
        </div>
      )}
    </div>
  )
}
