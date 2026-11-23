import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TieuDeTrang } from '../../components/BoCuc'
import { NhanTrangThai, TrangTrong } from '../../components/GiaoDienCoBan'
import PhanTrang from '../../components/PhanTrang'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { ngayGioVN, tienVND } from '../../lib/dinhDang'
import { useGocQuanLy } from '../../lib/gocQuanLy'
import { useDebounce } from '../../hooks/useDebounce'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { CAC_TRANG_THAI_DON, NHAN_PHUONG_THUC, NHAN_TRANG_THAI_DON, type TrangThaiDon } from '../../constants'
import type { DonHangTomTat, KetQuaPhanTrang } from '../../types'

const BO_LOC_TRANG_THAI: { gia: TrangThaiDon | ''; nhan: string }[] = [{ gia: '', nhan: 'Tất cả' }, ...CAC_TRANG_THAI_DON.map((tt) => ({ gia: tt, nhan: NHAN_TRANG_THAI_DON[tt] }))]

export default function DonHangCanXuLy() {
  const chuyenTrang = useNavigate()
  const goc = useGocQuanLy()
  const [trangThaiLoc, setTrangThaiLoc] = useState<TrangThaiDon | ''>('cho_xac_nhan')
  const [tuKhoa, setTuKhoa] = useState('')
  const [trang, setTrang] = useState(1)
  const tuKhoaTre = useDebounce(tuKhoa.trim(), 300)

  const { duLieu: ketQua, loi: loiTai } = useTaiDuLieu<KetQuaPhanTrang<DonHangTomTat>>('/don-hang/quan-ly', {
    trangThai: trangThaiLoc || undefined,
    query: tuKhoaTre || undefined,
    trang,
    soLuong: 20,
  })
  const dsDon = ketQua?.duLieu ?? []

  return (
    <>
      <TieuDeTrang title="Đơn hàng cần xử lý" desc="Tiếp nhận, xác nhận và theo dõi đơn của khách hàng." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {BO_LOC_TRANG_THAI.map((boLoc) => (
            <button
              key={boLoc.gia}
              onClick={() => {
                setTrangThaiLoc(boLoc.gia)
                setTrang(1)
              }}
              className={cx('rounded-md px-3 py-2 text-sm font-semibold transition-colors', trangThaiLoc === boLoc.gia ? 'bg-ink text-white' : 'bg-white hover:bg-surface-2')}
            >
              {boLoc.nhan}
            </button>
          ))}
        </div>
        <input
          placeholder="Tìm theo mã, tên, số điện thoại"
          aria-label="Tìm đơn hàng"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.currentTarget.value)
            setTrang(1)
          }}
          className="h-10 w-full rounded-md bg-white px-3 text-[15px] focus:outline-2 focus:outline-brand sm:w-72"
        />
      </div>

      {loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : !ketQua ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : dsDon.length === 0 ? (
        <TrangTrong>Không có đơn hàng nào.</TrangTrong>
      ) : (
        <>
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
                {dsDon.map((don) => (
                  <tr key={don.ma} onClick={() => chuyenTrang(`${goc}/don-hang/${don.ma}`)} className="cursor-pointer hover:bg-surface">
                    <td className={cx(td, 'font-bold')}>
                      <Link to={`${goc}/don-hang/${don.ma}`} className="text-brand" onClick={(e) => e.stopPropagation()}>
                        {don.ma}
                      </Link>
                    </td>
                    <td className={td}>
                      {don.tenNguoiNhan}
                      <div className="text-sm text-muted">{don.soDienThoai}</div>
                    </td>
                    <td className={cx(td, 'whitespace-nowrap')}>{ngayGioVN(don.ngayDat)}</td>
                    <td className={td}>{don.phuongThuc ? (NHAN_PHUONG_THUC[don.phuongThuc] ?? don.phuongThuc) : ''}</td>
                    <td className={cx(td, 'font-semibold whitespace-nowrap')}>{tienVND(don.tongTien)}</td>
                    <td className={td}>
                      <NhanTrangThai status={NHAN_TRANG_THAI_DON[don.trangThai]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PhanTrang trang={ketQua.trang} tongTrang={ketQua.tongTrang} tong={ketQua.tong} donVi="đơn hàng" onDoiTrang={setTrang} />
        </>
      )}
    </>
  )
}
