import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Nut, OChon, TrangTrong } from '../../components/GiaoDienCoBan'
import { AnhSanPham } from '../../components/SanPham'
import { cx } from '../../lib/lopCss'
import { tienVND } from '../../lib/dinhDang'
import { useDebounce } from '../../hooks/useDebounce'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useGioHang } from '../../store/gioHang'
import { useTroLy } from '../../store/troLy'
import type { SanPham } from '../../types'

type NhuCau = 'choi_game' | 'do_hoa' | 'van_phong'
type LinhKienDeXuat = Omit<SanPham, 'danhMuc' | 'anh' | 'thongSo'> & { danhMuc: string; anh: string | null }
type KetQuaDeXuat = { nganSach: number; nhuCau: NhuCau; tongTien: number; conLai: number; cacMuc: LinhKienDeXuat[] }

const MUC_NGAN_SACH = [10, 15, 20, 30, 45]
const CAC_NHU_CAU: { gia: NhuCau; nhan: string }[] = [
  { gia: 'choi_game', nhan: 'Chơi game' },
  { gia: 'do_hoa', nhan: 'Đồ họa - dựng phim' },
  { gia: 'van_phong', nhan: 'Văn phòng - học tập' },
]

const thanhSanPham = ({ danhMuc, anh, ...con }: LinhKienDeXuat): SanPham => ({ ...con, danhMuc: { id: 0, ten: danhMuc }, anh: anh ? [{ duongDan: anh }] : [], thongSo: null })

export default function BuildPC() {
  const chuyenTrang = useNavigate()
  const hienTroLy = useTroLy((s) => s.show)
  const them = useGioHang((s) => s.them)
  const [nganSach, setNganSach] = useState(20_000_000)
  const [nhuCau, setNhuCau] = useState<NhuCau>('choi_game')
  const nganSachTre = useDebounce(nganSach, 400)

  const { duLieu: ketQua, loi } = useTaiDuLieu<KetQuaDeXuat>('/build-pc/de-xuat', { nganSach: nganSachTre, nhuCau })

  function themCaBo() {
    ketQua?.cacMuc.forEach((linhKien) => them(thanhSanPham(linhKien), 1))
    chuyenTrang('/gio-hang')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-extrabold tracking-tight">Build PC theo ngân sách</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Chọn ngân sách và nhu cầu. Hệ thống đề xuất bộ linh kiện còn hàng và tương thích với nhau (socket CPU, loại RAM, công suất nguồn).
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
        <section className="h-fit space-y-6 rounded-xl bg-surface p-6 lg:sticky lg:top-24" aria-label="Thiết lập">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="nganSach" className="font-semibold">
                Ngân sách
              </label>
              <output className="text-2xl font-extrabold text-brand">{tienVND(nganSach)}</output>
            </div>
            <input
              id="nganSach"
              type="range"
              min={8_000_000}
              max={60_000_000}
              step={500_000}
              value={nganSach}
              onChange={(e) => setNganSach(Number(e.target.value))}
              className="mt-3 h-2 w-full accent-brand"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {MUC_NGAN_SACH.map((m) => (
                <button
                  key={m}
                  onClick={() => setNganSach(m * 1_000_000)}
                  className={cx('rounded-md px-3 py-1.5 text-sm font-semibold', nganSach === m * 1_000_000 ? 'bg-brand text-white' : 'bg-white hover:bg-surface-2')}
                >
                  {m} triệu
                </button>
              ))}
            </div>
          </div>
          <OChon label="Nhu cầu sử dụng" value={nhuCau} onChange={(e) => setNhuCau(e.currentTarget.value as NhuCau)}>
            {CAC_NHU_CAU.map((nc) => (
              <option key={nc.gia} value={nc.gia}>
                {nc.nhan}
              </option>
            ))}
          </OChon>
          <button onClick={hienTroLy} className="font-semibold text-brand hover:underline">
            Nhờ trợ lý tư vấn thêm
          </button>
        </section>

        <section aria-label="Cấu hình đề xuất">
          {loi ? (
            <TrangTrong>{loi}</TrangTrong>
          ) : !ketQua ? (
            <TrangTrong>Đang chọn linh kiện...</TrangTrong>
          ) : (
            <>
              <ul className="space-y-3">
                {ketQua.cacMuc.map((lk) => (
                  <li key={lk.id} className="flex items-center gap-4 rounded-lg bg-surface p-3 sm:p-4">
                    <Link to={`/san-pham/${lk.id}`} className="w-20 shrink-0 overflow-hidden rounded-md sm:w-24">
                      <AnhSanPham product={thanhSanPham(lk)} className="p-2 [&_span]:text-[10px] [&_span:nth-child(2)]:text-sm" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-muted">{lk.danhMuc}</div>
                      <Link to={`/san-pham/${lk.id}`} className="font-semibold hover:text-brand">
                        {lk.ten}
                      </Link>
                    </div>
                    <span className="font-bold whitespace-nowrap">{tienVND(lk.gia)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-ink p-6 text-white">
                <div>
                  <div className="text-white/70">Tổng cấu hình (còn lại {tienVND(ketQua.conLai)})</div>
                  <div className="text-3xl font-extrabold">{tienVND(ketQua.tongTien)}</div>
                </div>
                <Nut size="lg" onClick={themCaBo}>
                  Thêm cả bộ vào giỏ
                </Nut>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
