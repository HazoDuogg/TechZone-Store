import { Link } from 'react-router-dom'
import { CAC_BUOC_DON, NHAN_PHUONG_THUC, NHAN_TRANG_THAI_DON, NHAN_TRANG_THAI_THANH_TOAN, type TrangThaiDon } from '../constants'
import type { DonHangChiTiet } from '../types'
import { cx } from '../lib/lopCss'
import { ngayGioVN, tienVND } from '../lib/dinhDang'
import { NhanTrangThai } from './GiaoDienCoBan'

export function TienTrinhDon({ trangThai }: { trangThai: TrangThaiDon }) {
  if (trangThai === 'da_huy') return <div className="rounded-lg bg-danger/10 px-4 py-3 font-semibold text-danger">Đơn hàng đã được hủy</div>
  const viTri = CAC_BUOC_DON.indexOf(trangThai)
  return (
    <ol className="grid grid-cols-4 gap-2">
      {CAC_BUOC_DON.map((buoc, i) => (
        <li key={buoc} className="text-center">
          <div className={cx('h-2 rounded-full', i <= viTri ? 'bg-brand' : 'bg-surface-2')} />
          <div className={cx('mt-2 text-[13px] leading-tight sm:text-sm', i <= viTri ? 'font-semibold text-ink' : 'text-muted')}>{NHAN_TRANG_THAI_DON[buoc]}</div>
        </li>
      ))}
    </ol>
  )
}

export function NoiDungDonHang({ don, nhanVien }: { don: DonHangChiTiet; nhanVien?: boolean }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm text-muted">Mã đơn hàng</div>
            <div className="text-xl font-extrabold">{don.ma}</div>
          </div>
          <NhanTrangThai status={NHAN_TRANG_THAI_DON[don.trangThai]} />
        </div>
        <TienTrinhDon trangThai={don.trangThai} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl bg-surface p-5 sm:p-6">
          <h2 className="mb-3 font-bold">Thông tin nhận hàng</h2>
          <dl className="space-y-1.5 text-[15px]">
            <div>
              <dt className="inline text-muted">Người nhận: </dt>
              <dd className="inline font-medium">{don.tenNguoiNhan}</dd>
            </div>
            <div>
              <dt className="inline text-muted">Điện thoại: </dt>
              <dd className="inline font-medium">{don.soDienThoai}</dd>
            </div>
            {nhanVien && don.email && (
              <div>
                <dt className="inline text-muted">Email: </dt>
                <dd className="inline font-medium">{don.email}</dd>
              </div>
            )}
            <div>
              <dt className="inline text-muted">Địa chỉ: </dt>
              <dd className="inline font-medium">{don.diaChi}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-xl bg-surface p-5 sm:p-6">
          <h2 className="mb-3 font-bold">Thanh toán</h2>
          <dl className="space-y-1.5 text-[15px]">
            {don.thanhToan && (
              <>
                <div>
                  <dt className="inline text-muted">Phương thức: </dt>
                  <dd className="inline font-medium">{NHAN_PHUONG_THUC[don.thanhToan.phuongThuc] ?? don.thanhToan.phuongThuc}</dd>
                </div>
                <div>
                  <dt className="inline text-muted">Tình trạng: </dt>
                  <dd className="inline font-medium">{NHAN_TRANG_THAI_THANH_TOAN[don.thanhToan.trangThai] ?? don.thanhToan.trangThai}</dd>
                </div>
              </>
            )}
            <div>
              <dt className="inline text-muted">Ngày đặt: </dt>
              <dd className="inline font-medium">{ngayGioVN(don.ngayDat)}</dd>
            </div>
            {don.ngayHoanTat && (
              <div>
                <dt className="inline text-muted">Hoàn tất: </dt>
                <dd className="inline font-medium">{ngayGioVN(don.ngayHoanTat)}</dd>
              </div>
            )}
            {nhanVien && don.nhanVienXuLy && (
              <div>
                <dt className="inline text-muted">Nhân viên xử lý: </dt>
                <dd className="inline font-medium">{don.nhanVienXuLy}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <section className="rounded-xl bg-surface p-5 sm:p-6">
        <h2 className="mb-3 font-bold">Sản phẩm</h2>
        <ul className="space-y-3">
          {don.cacDong.map((dong) => (
            <li key={dong.idSanPham} className="flex items-start justify-between gap-4 text-[15px]">
              <Link to={`/san-pham/${dong.idSanPham}`} className="font-medium hover:text-brand">
                {dong.ten} <span className="text-muted">× {dong.soLuong}</span>
              </Link>
              <span className="font-semibold whitespace-nowrap">{tienVND(dong.donGia * dong.soLuong)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-1.5 border-t border-surface-2 pt-4 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">Tạm tính</dt>
            <dd>{tienVND(don.tamTinh)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Giảm giá</dt>
            <dd>{don.tienGiam ? '−' + tienVND(don.tienGiam) : tienVND(0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Vận chuyển</dt>
            <dd>{don.phiVanChuyen ? tienVND(don.phiVanChuyen) : 'Miễn phí'}</dd>
          </div>
          <div className="flex justify-between pt-2 text-lg font-bold">
            <dt>Tổng cộng</dt>
            <dd className="text-brand">{tienVND(don.tongTien)}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
