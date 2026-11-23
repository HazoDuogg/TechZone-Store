import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { HopThoai, Nut, TrangTrong } from '../../components/GiaoDienCoBan'
import { NoiDungDonHang } from '../../components/HienThiDonHang'
import api from '../../lib/api'
import { useAuthStore } from '../../auth/auth'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import type { DonHangChiTiet } from '../../types'

type KetQuaTraCuu = { don: DonHangChiTiet; soDienThoai: string }

export default function ChiTietDonHang() {
  const { code } = useParams()
  const traCuu = (useLocation().state as { traCuu?: KetQuaTraCuu } | null)?.traCuu
  const duLieuTraCuu = traCuu?.don.ma === code ? traCuu : undefined
  const laKhachHang = useAuthStore((s) => s.user?.vaiTro === 'khach_hang')
  const [donSauHuy, setDonSauHuy] = useState<DonHangChiTiet>()
  const [dangXacNhanHuy, setDangXacNhanHuy] = useState(false)
  const { dangGui, loi, xoaLoi, gui } = useGuiForm()
  const { duLieu, loi: loiTai } = useTaiDuLieu<DonHangChiTiet>(!duLieuTraCuu && laKhachHang ? `/don-hang/cua-toi/${code}` : null)
  const don = donSauHuy?.ma === code ? donSauHuy : (duLieuTraCuu?.don ?? duLieu)

  if (!duLieuTraCuu && !laKhachHang)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <TrangTrong>
          Hãy tra cứu bằng mã đơn và số điện thoại để xem đơn này.{' '}
          <Link to="/don-hang" className="font-semibold text-brand">
            Tra cứu đơn hàng
          </Link>
        </TrangTrong>
      </div>
    )
  if (loiTai)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <TrangTrong>
          {loiTai}.{' '}
          <Link to="/don-hang" className="font-semibold text-brand">
            Quay lại đơn hàng
          </Link>
        </TrangTrong>
      </div>
    )
  if (!don)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <TrangTrong>Đang tải...</TrangTrong>
      </div>
    )

  function huyDon() {
    gui(
      () => api.post<DonHangChiTiet>(`/don-hang/${don!.ma}/huy`, duLieuTraCuu ? { soDienThoai: duLieuTraCuu.soDienThoai } : {}).then((res) => setDonSauHuy(res.data)),
      () => setDangXacNhanHuy(false),
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link to="/don-hang" className="text-sm font-semibold text-brand hover:underline">
        ← Đơn hàng
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold tracking-tight">Chi tiết đơn hàng</h1>
      <NoiDungDonHang don={don} />
      {don.trangThai === 'cho_xac_nhan' ? (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Nut
            variant="danger"
            onClick={() => {
              xoaLoi()
              setDangXacNhanHuy(true)
            }}
          >
            Hủy đơn hàng
          </Nut>
          <span className="text-sm text-muted">Chỉ hủy được khi đơn chưa được xác nhận.</span>
        </div>
      ) : (
        don.trangThai !== 'da_huy' && <p className="mt-6 text-sm text-muted">Đơn đã được xử lý nên không thể tự hủy. Vui lòng liên hệ cửa hàng nếu cần hỗ trợ.</p>
      )}

      {dangXacNhanHuy && (
        <HopThoai title="Hủy đơn hàng" onClose={() => setDangXacNhanHuy(false)}>
          {loi && <p className="mb-3 text-sm font-semibold text-danger">{loi}</p>}
          <p>
            Bạn chắc chắn muốn hủy đơn <b>{don.ma}</b>? Sau khi hủy sẽ không khôi phục được.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Nut variant="soft" onClick={() => setDangXacNhanHuy(false)}>
              Giữ đơn
            </Nut>
            <Nut variant="danger" disabled={dangGui} onClick={huyDon}>
              {dangGui ? 'Đang hủy...' : 'Hủy đơn'}
            </Nut>
          </div>
        </HopThoai>
      )}
    </div>
  )
}
