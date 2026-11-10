import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Nut, TruongNhap, NhanTrangThai, ThanhTab } from '../../components/GiaoDienCoBan'
import { dsDonHang } from '../../data/duLieuMau'
import { ngayGioVN, tienVND, tongTienDon } from '../../lib/dinhDang'

const CAC_TAB = ['Lịch sử đơn hàng', 'Tra cứu đơn hàng'] as const

export default function DonHang() {
  const chuyenTrang = useNavigate()
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>('Lịch sử đơn hàng')
  const lichSuDon = dsDonHang

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Đơn hàng</h1>
      <div className="mt-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>

      {tab === 'Tra cứu đơn hàng' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            chuyenTrang('/don-hang/TZ240003')
          }}
          className="mt-6 max-w-lg space-y-4 rounded-xl bg-surface p-6"
        >
          <p className="text-muted">Dành cho khách đặt hàng không cần tài khoản. Nhập mã đơn trong tin nhắn xác nhận và số điện thoại đã đặt.</p>
          <TruongNhap label="Mã đơn hàng" placeholder="TZ240003" />
          <TruongNhap label="Số điện thoại" placeholder="0901234567" inputMode="tel" />
          <Nut size="lg" className="w-full">
            Tra cứu
          </Nut>
        </form>
      ) : (
        <ul className="mt-6 space-y-3">
          {lichSuDon.map((don) => (
            <li key={don.code}>
              <Link to={`/don-hang/${don.code}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface p-5 transition-colors hover:bg-surface-2">
                <div>
                  <div className="font-bold">{don.code}</div>
                  <div className="text-sm text-muted">
                    {ngayGioVN(don.createdAt)} · {don.items.reduce((tong, dong) => tong + dong.qty, 0)} sản phẩm
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <NhanTrangThai status={don.status} />
                  <span className="font-bold text-brand">{tienVND(tongTienDon(don))}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
