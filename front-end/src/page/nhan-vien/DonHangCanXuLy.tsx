import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TieuDeTrang } from '../../components/BoCuc'
import { NhanTrangThai } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsDonHang } from '../../data/duLieuMau'
import { CAC_TRANG_THAI_DON } from '../../constants'
import { ngayGioVN, tienVND, tongTienDon } from '../../lib/dinhDang'
import { useGocQuanLy } from '../../lib/gocQuanLy'

const BO_LOC_TRANG_THAI = ['Tất cả', ...CAC_TRANG_THAI_DON]

export default function DonHangCanXuLy() {
  const chuyenTrang = useNavigate()
  const goc = useGocQuanLy()
  const [trangThaiLoc, setTrangThaiLoc] = useState('Chờ xác nhận')

  return (
    <>
      <TieuDeTrang title="Đơn hàng cần xử lý" desc="Tiếp nhận, xác nhận và theo dõi đơn của khách hàng." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {BO_LOC_TRANG_THAI.map((trangThai) => (
            <button
              key={trangThai}
              onClick={() => setTrangThaiLoc(trangThai)}
              className={cx('rounded-md px-3 py-2 text-sm font-semibold transition-colors', trangThaiLoc === trangThai ? 'bg-ink text-white' : 'bg-white hover:bg-surface-2')}
            >
              {trangThai}
            </button>
          ))}
        </div>
        <input
          placeholder="Tìm theo mã, tên, số điện thoại"
          aria-label="Tìm đơn hàng"
          className="h-10 w-full rounded-md bg-white px-3 text-[15px] focus:outline-2 focus:outline-brand sm:w-72"
        />
      </div>

      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Mã đơn</th>
              <th className={th}>Khách hàng</th>
              <th className={th}>Thời gian</th>
              <th className={th}>Thanh toán</th>
              <th className={th}>Tổng tiền</th>
              <th className={th}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {dsDonHang.map((don) => (
              <tr key={don.code} onClick={() => chuyenTrang(`${goc}/don-hang/${don.code}`)} className="cursor-pointer hover:bg-surface">
                <td className={cx(td, 'font-bold')}>
                  <Link to={`${goc}/don-hang/${don.code}`} className="text-brand">
                    {don.code}
                  </Link>
                </td>
                <td className={td}>
                  {don.customer}
                  <div className="text-sm text-muted">{don.phone}</div>
                </td>
                <td className={cx(td, 'whitespace-nowrap')}>{ngayGioVN(don.createdAt)}</td>
                <td className={td}>{don.payment}</td>
                <td className={cx(td, 'font-semibold whitespace-nowrap')}>{tienVND(tongTienDon(don))}</td>
                <td className={td}>
                  <NhanTrangThai status={don.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
