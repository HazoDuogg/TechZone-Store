import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { ThanhTab, TrangTrong } from '../../components/GiaoDienCoBan'
import { tienVND } from '../../lib/dinhDang'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import type { BaoCaoTongQuan } from '../../types'

const CAC_KHOANG_THOI_GIAN = ['6 tháng', '12 tháng'] as const

const nhanThang = (thang: string) => thang.slice(5) + '/' + thang.slice(2, 4)

export default function BaoCaoThongKe() {
  const [khoang, setKhoang] = useState<(typeof CAC_KHOANG_THOI_GIAN)[number]>('6 tháng')
  const { duLieu: bc, loi } = useTaiDuLieu<BaoCaoTongQuan>('/bao-cao/tong-quan', { soThang: khoang === '6 tháng' ? 6 : 12 })

  const tieuDe = (
    <TieuDeTrang
      title="Báo cáo thống kê"
      desc="Doanh thu tính theo đơn đã hoàn tất, cùng sản phẩm bán chạy và tình trạng tồn kho."
      action={<ThanhTab value={khoang} onChange={setKhoang} items={CAC_KHOANG_THOI_GIAN} />}
    />
  )
  if (loi)
    return (
      <>
        {tieuDe}
        <p className="font-semibold text-danger">{loi}</p>
      </>
    )
  if (!bc)
    return (
      <>
        {tieuDe}
        <TrangTrong>Đang tải...</TrangTrong>
      </>
    )

  const lonNhat = Math.max(...bc.doanhThuTheoThang.map((t) => t.doanhThu), 1)
  const cacOThongKe = [
    ['Doanh thu', tienVND(bc.tong.doanhThu)],
    ['Đơn hoàn tất', String(bc.tong.soDonHoanTat)],
    ['Giá trị trung bình / đơn', tienVND(bc.tong.giaTriTrungBinh)],
    ['Giá trị tồn kho (theo giá bán)', tienVND(bc.tong.giaTriTonKho)],
  ]
  const cacOPhu = [
    ['Đơn đang xử lý', bc.tong.soDonDangXuLy],
    ['Đơn đã hủy', bc.tong.soDonDaHuy],
    ['Khách hàng mới', bc.tong.khachHangMoi],
    ['Phiếu bảo hành đang mở', (bc.baoHanh.tiep_nhan ?? 0) + (bc.baoHanh.dang_xu_ly ?? 0)],
  ]

  return (
    <>
      {tieuDe}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cacOThongKe.map(([nhan, giaTri]) => (
          <div key={nhan} className="rounded-xl bg-white p-5">
            <div className="text-sm text-muted">{nhan}</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">{giaTri}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cacOPhu.map(([nhan, giaTri]) => (
          <div key={nhan} className="flex items-baseline justify-between rounded-xl bg-white px-5 py-3">
            <span className="text-sm text-muted">{nhan}</span>
            <span className="text-lg font-bold tabular-nums">{giaTri}</span>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-xl bg-white p-5 sm:p-6" aria-labelledby="doanh-thu">
        <h2 id="doanh-thu" className="font-bold">
          Doanh thu theo tháng (triệu đồng)
        </h2>
        <div className="mt-6 flex h-64 items-end gap-2 sm:gap-3" role="img" aria-label="Biểu đồ cột doanh thu theo tháng">
          {bc.doanhThuTheoThang.map((t, i) => (
            <div key={t.thang} className="flex h-full min-w-0 flex-1 flex-col justify-end text-center">
              <span className="mb-1 text-xs font-semibold tabular-nums sm:text-sm">{(t.doanhThu / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}</span>
              <div
                className={cx('rounded-t-sm', i === bc.doanhThuTheoThang.length - 1 ? 'bg-brand' : 'bg-brand/35')}
                style={{ height: `${Math.max((t.doanhThu / lonNhat) * 80, t.doanhThu > 0 ? 2 : 0)}%` }}
              />
              <span className="mt-2 text-xs text-muted sm:text-sm">{nhanThang(t.thang)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="ban-chay">
          <h2 id="ban-chay" className="mb-3 font-bold">
            Sản phẩm bán chạy
          </h2>
          {bc.banChay.length === 0 ? (
            <TrangTrong>Chưa có đơn hoàn tất trong khoảng này.</TrangTrong>
          ) : (
            <div className={cx(tableWrap, 'bg-white')}>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={th}>Sản phẩm</th>
                    <th className={th}>Đã bán</th>
                    <th className={th}>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {bc.banChay.map((sp) => (
                    <tr key={sp.idSanPham}>
                      <td className={td}>{sp.ten}</td>
                      <td className={cx(td, 'font-bold tabular-nums')}>{sp.soLuong}</td>
                      <td className={cx(td, 'whitespace-nowrap tabular-nums')}>{tienVND(sp.doanhThu)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section aria-labelledby="can-nhap">
          <h2 id="can-nhap" className="mb-3 font-bold">
            Cần nhập thêm
          </h2>
          {bc.canNhapThem.length === 0 ? (
            <TrangTrong>Mọi sản phẩm đang bán đều còn từ 5 chiếc trở lên.</TrangTrong>
          ) : (
            <div className={cx(tableWrap, 'bg-white')}>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={th}>Sản phẩm</th>
                    <th className={th}>Tồn</th>
                  </tr>
                </thead>
                <tbody>
                  {bc.canNhapThem.map((sp) => (
                    <tr key={sp.idSanPham}>
                      <td className={td}>{sp.ten}</td>
                      <td className={cx(td, 'font-bold tabular-nums', sp.tonKho === 0 ? 'text-danger' : 'text-warn')}>{sp.tonKho}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
