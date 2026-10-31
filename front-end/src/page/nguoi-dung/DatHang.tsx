import { useState } from 'react'
import { Nut, TruongNhap, NutLienKet, VungNhap } from '../../components/GiaoDienCoBan'
import TomTatDonHang from '../../components/TomTatDonHang'
import { cx } from '../../lib/lopCss'

const methods = [
  ['COD', 'Thanh toán tiền mặt khi nhận hàng'],
  ['Chuyển khoản', 'Quét mã VietQR sau khi đặt hàng'],
  ['Ví điện tử', 'Thanh toán qua MoMo hoặc ZaloPay'],
]

export default function DatHang() {
  const [pay, setPay] = useState('COD')
  const [done, setDone] = useState(false)

  if (done)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rise rounded-xl bg-ok/10 p-8 sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight">Đặt hàng thành công</h1>
          <p className="mt-3 text-lg">Cảm ơn bạn. Nhân viên sẽ gọi xác nhận đơn trong vòng 30 phút.</p>
          <dl className="mt-6 space-y-2 rounded-lg bg-white p-5">
            <div className="flex justify-between"><dt className="text-muted">Mã đơn hàng</dt><dd className="font-bold">TZ240007</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Phương thức thanh toán</dt><dd className="font-bold">{pay}</dd></div>
          </dl>
          <p className="mt-4 text-sm text-muted">Hãy lưu mã đơn. Bạn có thể tra cứu đơn bằng mã này và số điện thoại đã đặt hàng.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NutLienKet to="/don-hang/TZ240003">Xem chi tiết đơn</NutLienKet>
            <NutLienKet to="/san-pham" variant="soft">Tiếp tục mua sắm</NutLienKet>
          </div>
        </div>
      </div>
    )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Đặt hàng</h1>
      <p className="mt-1 text-muted">Không cần tài khoản.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setDone(true)
        }}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]"
      >
        <div className="space-y-8">
          <section aria-labelledby="ship">
            <h2 id="ship" className="mb-4 text-xl font-bold">Thông tin giao hàng</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TruongNhap label="Họ và tên" autoComplete="name" />
              <TruongNhap label="Số điện thoại" inputMode="tel" autoComplete="tel" />
              <TruongNhap label="Email (không bắt buộc)" type="email" autoComplete="email" className="sm:col-span-2" />
              <TruongNhap label="Địa chỉ nhận hàng" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" autoComplete="street-address" className="sm:col-span-2" />
              <VungNhap label="Ghi chú" className="sm:col-span-2" placeholder="Giờ nhận hàng, yêu cầu xuất hóa đơn VAT…" />
            </div>
          </section>

          <fieldset>
            <legend className="mb-4 text-xl font-bold">Phương thức thanh toán</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {methods.map(([m, note]) => (
                <label key={m} className={cx('block rounded-lg p-4 transition-colors', pay === m ? 'bg-brand-soft outline-2 outline-brand' : 'bg-surface hover:bg-surface-2')}>
                  <input type="radio" name="pay" checked={pay === m} onChange={() => setPay(m)} className="sr-only" />
                  <span className="block font-bold">{m}</span>
                  <span className="mt-1 block text-sm text-muted">{note}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <TomTatDonHang cta={<Nut size="lg" className="w-full">Xác nhận đặt hàng</Nut>} />
      </form>
    </div>
  )
}
