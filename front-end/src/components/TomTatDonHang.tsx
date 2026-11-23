import type { ReactNode } from 'react'
import { tienVND } from '../lib/dinhDang'
import { useTamTinh } from '../hooks/useTamTinh'
import { useGioHang } from '../store/gioHang'

export default function TomTatDonHang({ cta, maGiamGia = '' }: { cta?: ReactNode; maGiamGia?: string }) {
  const cacMuc = useGioHang((s) => s.cacMuc)
  const { ketQua, loi } = useTamTinh(
    cacMuc.map((muc) => ({ idSanPham: muc.sanPham.id, soLuong: muc.soLuong })),
    maGiamGia,
  )
  const tamTinhTaiMay = cacMuc.reduce((tong, muc) => tong + muc.sanPham.gia * muc.soLuong, 0)

  return (
    <aside className="h-fit rounded-xl bg-surface p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold">Tóm tắt đơn hàng</h2>
      <dl className="mt-4 space-y-2 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Tạm tính</dt>
          <dd className="font-semibold">{tienVND(ketQua?.tamTinh ?? tamTinhTaiMay)}</dd>
        </div>
        {ketQua && (
          <>
            <div className="flex justify-between">
              <dt className="text-muted">Giảm giá</dt>
              <dd className={ketQua.tienGiam > 0 ? 'font-semibold text-ok' : ''}>{ketQua.tienGiam > 0 ? '−' + tienVND(ketQua.tienGiam) : tienVND(0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Vận chuyển</dt>
              <dd>{ketQua.phiVanChuyen > 0 ? tienVND(ketQua.phiVanChuyen) : 'Miễn phí'}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-surface-2 pt-3 text-lg font-bold">
              <dt>Tổng cộng</dt>
              <dd className="text-2xl text-brand">{tienVND(ketQua.tongTien)}</dd>
            </div>
          </>
        )}
      </dl>
      {ketQua?.thongBaoMa && <p className="mt-3 text-sm font-semibold text-danger">{ketQua.thongBaoMa}</p>}
      {loi && <p className="mt-3 text-sm font-semibold text-danger">{loi}</p>}
      <p className="mt-3 text-sm text-muted">Miễn phí vận chuyển cho đơn từ 5.000.000 ₫. Thanh toán khi nhận hàng.</p>
      {cta && <div className="mt-5">{cta}</div>}
    </aside>
  )
}
