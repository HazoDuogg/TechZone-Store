import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TieuDeTrang } from '../../components/BoCuc'
import { NoiDungDonHang } from '../../components/HienThiDonHang'
import { Nhan, Nut, TrangTrong, HopThoai, TruongNhap } from '../../components/GiaoDienCoBan'
import { dsDonHang } from '../../data/duLieuMau'
import type { DongDonHang } from '../../types'
import { cx } from '../../lib/lopCss'
import { timSanPham } from '../../lib/dinhDang'
import { useGocQuanLy } from '../../lib/gocQuanLy'

function GanSerial({ cacDong }: { cacDong: DongDonHang[] }) {
  const [dangSua, setDangSua] = useState(false)
  const chuanHoa = () => cacDong.map((dong) => ({ ...dong, serials: Array.from({ length: dong.qty }, (_, viTri) => dong.serials[viTri] ?? '') }))
  const [daLuu, setDaLuu] = useState(chuanHoa)
  const [cacDongDangSua, setCacDongDangSua] = useState(daLuu)

  const capNhatSerial = (id: string, viTri: number, serial: string) =>
    setCacDongDangSua((truoc) => truoc.map((dong) => (dong.id === id ? { ...dong, serials: dong.serials.map((soSerial, k) => (k === viTri ? serial : soSerial)) } : dong)))

  const daDoi = JSON.stringify(cacDongDangSua) !== JSON.stringify(daLuu)
  const huy = () => {
    setCacDongDangSua(daLuu)
    setDangSua(false)
  }
  const luu = () => {
    setDaLuu(cacDongDangSua)
    setDangSua(false)
  }

  return (
    <section className={cx('mt-6 rounded-xl bg-white p-5', dangSua && 'ring-2 ring-brand/30')} aria-labelledby="serial">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="serial" className="flex flex-wrap items-center gap-2 font-bold">
            Số serial từng chiếc
            {dangSua && <Nhan tone="blue">Đang chỉnh sửa</Nhan>}
          </h2>
          <p className="mt-1 text-sm text-muted">Serial được hệ thống chọn khi xác nhận đơn. Đổi nếu chiếc đó không còn hoặc lấy nhầm.</p>
        </div>
        <div className="flex gap-2">
          {dangSua ? (
            <>
              <Nut size="sm" variant="soft" onClick={huy}>
                Hủy
              </Nut>
              <Nut size="sm" disabled={!daDoi} onClick={luu}>
                Lưu
              </Nut>
            </>
          ) : (
            <Nut size="sm" variant="soft" onClick={() => setDangSua(true)}>
              Đổi serial
            </Nut>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-5">
        {cacDongDangSua.map((dong) => (
          <div key={dong.id}>
            <div className="mb-2 font-semibold">
              {timSanPham(dong.id)?.name} <span className="font-normal text-muted">× {dong.qty}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {dong.serials.map((soSerial, viTri) => (
                <TruongNhap key={viTri} label={`Chiếc ${viTri + 1}`} value={soSerial} onChange={(e) => capNhatSerial(dong.id, viTri, e.currentTarget.value)} disabled={!dangSua} />
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
  const [dangXacNhanHuy, setDangXacNhanHuy] = useState(false)
  const don = dsDonHang.find((d) => d.code === code)

  if (!don)
    return (
      <TrangTrong>
        Không tìm thấy đơn hàng.{' '}
        <Link to={`${goc}/don-hang`} className="font-semibold text-brand">
          Quay lại danh sách
        </Link>
      </TrangTrong>
    )

  return (
    <>
      <Link to={`${goc}/don-hang`} className="text-sm font-semibold text-brand hover:underline">
        ← Danh sách đơn
      </Link>
      <TieuDeTrang
        title={`Đơn ${don.code}`}
        desc={don.payment === 'COD' ? 'Đơn thanh toán khi nhận hàng. Gọi xác nhận với khách trước khi chuyển trạng thái.' : undefined}
        action={
          <div className="flex gap-2">
            <Nut variant="danger" onClick={() => setDangXacNhanHuy(true)}>
              Hủy đơn
            </Nut>
            <Nut>Xác nhận đơn</Nut>
          </div>
        }
      />
      <NoiDungDonHang order={don} staff />
      {['Đã xác nhận', 'Đang giao', 'Hoàn tất'].includes(don.status) && <GanSerial cacDong={don.items} />}

      {dangXacNhanHuy && (
        <HopThoai title="Hủy đơn hàng" onClose={() => setDangXacNhanHuy(false)}>
          <p>
            Bạn chắc chắn muốn hủy đơn <b>{don.code}</b> của {don.customer}?
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Nut variant="soft" onClick={() => setDangXacNhanHuy(false)}>
              Giữ đơn
            </Nut>
            <Nut variant="danger" onClick={() => setDangXacNhanHuy(false)}>
              Hủy đơn
            </Nut>
          </div>
        </HopThoai>
      )}
    </>
  )
}
