import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Nut, TruongNhap, NutLienKet } from '../../components/GiaoDienCoBan'
import TomTatDonHang from '../../components/TomTatDonHang'
import api from '../../lib/api'
import { tienVND } from '../../lib/dinhDang'
import { layThongBaoLoi } from '../../lib/thongBaoLoi'
import { useAuthStore } from '../../auth/auth'
import { useGioHang } from '../../store/gioHang'

type KetQuaDatHang = {
  ma: string
  tamTinh: number
  tienGiam: number
  phiVanChuyen: number
  tongTien: number
}

export default function DatHang() {
  const user = useAuthStore((s) => s.user)
  const cacMuc = useGioHang((s) => s.cacMuc)
  const lamTrong = useGioHang((s) => s.lamTrong)
  const [ketQua, setKetQua] = useState<KetQuaDatHang | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangGui, setDangGui] = useState(false)

  async function datHang(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    setLoi(null)
    setDangGui(true)
    try {
      const res = await api.post<KetQuaDatHang>('/don-hang', {
        tenNguoiNhan: String(form.get('tenNguoiNhan')),
        soDienThoai: String(form.get('soDienThoai')),
        email: String(form.get('email')) || undefined,
        diaChi: String(form.get('diaChi')),
        maGiamGia: String(form.get('maGiamGia')),
        cacDong: cacMuc.map((muc) => ({ idSanPham: muc.sanPham.id, soLuong: muc.soLuong })),
      })
      setKetQua(res.data)
      lamTrong()
    } catch (err) {
      setLoi(layThongBaoLoi(err, 'Không đặt hàng được'))
    } finally {
      setDangGui(false)
    }
  }

  if (ketQua)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rise rounded-xl bg-ok/10 p-8 sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight">Đặt hàng thành công</h1>
          <p className="mt-3 text-lg">Cảm ơn bạn. Nhân viên sẽ gọi xác nhận đơn trong vòng 30 phút.</p>
          <dl className="mt-6 space-y-2 rounded-lg bg-white p-5">
            <div className="flex justify-between">
              <dt className="text-muted">Mã đơn hàng</dt>
              <dd className="font-bold">{ketQua.ma}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Tạm tính</dt>
              <dd>{tienVND(ketQua.tamTinh)}</dd>
            </div>
            {ketQua.tienGiam > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Giảm giá</dt>
                <dd className="text-ok">-{tienVND(ketQua.tienGiam)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Vận chuyển</dt>
              <dd>{ketQua.phiVanChuyen > 0 ? tienVND(ketQua.phiVanChuyen) : 'Miễn phí'}</dd>
            </div>
            <div className="flex justify-between border-t border-surface-2 pt-2 text-lg">
              <dt className="font-bold">Tổng cộng</dt>
              <dd className="font-bold text-brand">{tienVND(ketQua.tongTien)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Thanh toán</dt>
              <dd className="font-bold">Khi nhận hàng (COD)</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted">Hãy lưu lại mã đơn hàng.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NutLienKet to="/san-pham">Tiếp tục mua sắm</NutLienKet>
          </div>
        </div>
      </div>
    )

  if (cacMuc.length === 0) return <Navigate to="/gio-hang" replace />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Đặt hàng</h1>
      {!user && <p className="mt-1 text-muted">Không cần tài khoản.</p>}
      <form onSubmit={datHang} className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-8">
          <section aria-labelledby="ship">
            <h2 id="ship" className="mb-4 text-xl font-bold">
              Thông tin giao hàng
            </h2>
            {loi && <p className="mb-4 font-semibold text-danger">{loi}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <TruongNhap name="tenNguoiNhan" label="Họ và tên" required autoComplete="name" defaultValue={user?.hoTen ?? ''} />
              <TruongNhap name="soDienThoai" label="Số điện thoại" required inputMode="tel" autoComplete="tel" defaultValue={user?.soDienThoai ?? ''} />
              <TruongNhap name="email" label="Email (không bắt buộc)" type="email" autoComplete="email" className="sm:col-span-2" defaultValue={user?.email ?? ''} />
              <TruongNhap
                name="diaChi"
                label="Địa chỉ nhận hàng"
                required
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                autoComplete="street-address"
                className="sm:col-span-2"
              />
              <TruongNhap name="maGiamGia" label="Mã giảm giá (không bắt buộc)" placeholder="Ví dụ: TECH10" className="sm:col-span-2 [&_input]:uppercase" />
            </div>
          </section>

          <section aria-labelledby="thanh-toan">
            <h2 id="thanh-toan" className="mb-4 text-xl font-bold">
              Phương thức thanh toán
            </h2>
            <div className="rounded-lg bg-brand-soft p-4 outline-2 outline-brand">
              <span className="block font-bold">Thanh toán khi nhận hàng (COD)</span>
              <span className="mt-1 block text-sm text-muted">Cửa hàng hiện chỉ hỗ trợ thanh toán tiền mặt khi nhận hàng.</span>
            </div>
          </section>
        </div>
        <TomTatDonHang
          cta={
            <Nut size="lg" className="w-full" disabled={dangGui}>
              {dangGui ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
            </Nut>
          }
        />
      </form>
    </div>
  )
}
