import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Nut, NutLienKet, OChon, TrangTrong, TruongNhap, NhanTrangThai, ThanhTab } from '../../components/GiaoDienCoBan'
import PhanTrang from '../../components/PhanTrang'
import api from '../../lib/api'
import { ngayGioVN, tienVND } from '../../lib/dinhDang'
import { useAuthStore } from '../../auth/auth'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { CAC_TRANG_THAI_DON, NHAN_TRANG_THAI_DON } from '../../constants'
import type { DonHangChiTiet, DonHangCuaToi, KetQuaPhanTrang } from '../../types'

const CAC_TAB = ['Lịch sử đơn hàng', 'Tra cứu đơn hàng'] as const

function LichSuDon() {
  const laKhachHang = useAuthStore((s) => s.user?.vaiTro === 'khach_hang')
  const [trangThai, setTrangThai] = useState('')
  const [trang, setTrang] = useState(1)
  const { duLieu: ketQua, loi } = useTaiDuLieu<KetQuaPhanTrang<DonHangCuaToi>>(laKhachHang ? '/don-hang/cua-toi' : null, {
    trangThai: trangThai || undefined,
    trang,
    soLuong: 10,
  })

  if (!laKhachHang)
    return (
      <div className="mt-6">
        <TrangTrong>
          Lịch sử đơn hàng chỉ dành cho tài khoản khách hàng.{' '}
          <Link to="/dang-nhap" className="font-semibold text-brand">
            Đăng nhập
          </Link>{' '}
          hoặc dùng tab Tra cứu đơn hàng nếu bạn đặt không cần tài khoản.
        </TrangTrong>
      </div>
    )

  return (
    <div className="mt-6">
      <OChon
        aria-label="Lọc theo trạng thái đơn"
        value={trangThai}
        onChange={(e) => {
          setTrangThai(e.currentTarget.value)
          setTrang(1)
        }}
        className="mb-4 w-35"
      >
        <option value="">Trạng thái</option>
        {CAC_TRANG_THAI_DON.map((tt) => (
          <option key={tt} value={tt}>
            {NHAN_TRANG_THAI_DON[tt]}
          </option>
        ))}
      </OChon>

      {loi ? (
        <p className="font-semibold text-danger">{loi}</p>
      ) : !ketQua ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : ketQua.duLieu.length === 0 ? (
        <TrangTrong>
          {trangThai ? 'Không có đơn nào ở trạng thái này.' : 'Bạn chưa có đơn hàng nào.'}
          <br />
          {!trangThai && (
            <NutLienKet to="/san-pham" variant="soft" size="sm" className="ml-2">
              Mua sắm ngay
            </NutLienKet>
          )}
        </TrangTrong>
      ) : (
        <>
          <ul className="space-y-3">
            {ketQua.duLieu.map((don) => (
              <li key={don.ma}>
                <Link to={`/don-hang/${don.ma}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface p-5 transition-colors hover:bg-surface-2">
                  <div className="min-w-0">
                    <div className="font-bold">{don.ma}</div>
                    <div className="truncate text-sm text-muted">
                      {ngayGioVN(don.ngayDat)} · {don.tenSanPhamDau}
                      {don.soDong > 1 && ` và ${don.soDong - 1} sản phẩm khác`}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <NhanTrangThai status={NHAN_TRANG_THAI_DON[don.trangThai]} />
                    <span className="font-bold text-brand">{tienVND(don.tongTien)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <PhanTrang trang={ketQua.trang} tongTrang={ketQua.tongTrang} tong={ketQua.tong} donVi="đơn hàng" onDoiTrang={setTrang} />
        </>
      )}
    </div>
  )
}

function TraCuuDon() {
  const chuyenTrang = useNavigate()
  const { dangGui, loi, gui } = useGuiForm()

  function traCuu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const soDienThoai = String(form.get('soDienThoai')).trim()
    let don: DonHangChiTiet
    gui(
      () => api.post<DonHangChiTiet>('/don-hang/tra-cuu', { ma: String(form.get('ma')), soDienThoai }).then((res) => (don = res.data)),
      () => chuyenTrang(`/don-hang/${don.ma}`, { state: { traCuu: { don, soDienThoai } } }),
    )
  }

  return (
    <form onSubmit={traCuu} className="mt-6 max-w-lg space-y-4 rounded-xl bg-surface p-6">
      <p className="text-muted">Dành cho khách đặt hàng không cần tài khoản. Nhập mã đơn trong tin nhắn xác nhận và số điện thoại đã đặt.</p>
      {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
      <TruongNhap name="ma" label="Mã đơn hàng" placeholder="TZ1A2B3C4D" required />
      <TruongNhap name="soDienThoai" label="Số điện thoại" placeholder="0901234567" inputMode="tel" required />
      <Nut size="lg" className="w-full" disabled={dangGui}>
        {dangGui ? 'Đang tra cứu...' : 'Tra cứu'}
      </Nut>
    </form>
  )
}

export default function DonHang() {
  const laKhachHang = useAuthStore((s) => s.user?.vaiTro === 'khach_hang')
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>(laKhachHang ? 'Lịch sử đơn hàng' : 'Tra cứu đơn hàng')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Đơn hàng</h1>
      <div className="mt-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>
      {tab === 'Tra cứu đơn hàng' ? <TraCuuDon /> : <LichSuDon />}
    </div>
  )
}
