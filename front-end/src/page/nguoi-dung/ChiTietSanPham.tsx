import { useState, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Nut, TrangTrong } from '../../components/GiaoDienCoBan'
import { td } from '../../lib/lopCss'
import { GiaSanPham, TheSanPham, GhiChuTonKho } from '../../components/SanPham'
import ThuVienAnh from '../../components/ThuVienAnh'
import { useTroLy } from '../../store/troLy'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import type { KetQuaDanhSachSanPham, SanPhamChiTiet } from '../../types'
import { useGioHang } from '../../store/gioHang'
import { useThongBao } from '../../store/thongBao'

export default function ChiTietSanPham() {
  const { id } = useParams()
  return <NoiDungChiTiet key={id} id={id} />
}

function NoiDungChiTiet({ id }: { id?: string }) {
  const show = useTroLy((s) => s.show)
  const [soLuong, setSoLuong] = useState(1)
  const chuyenTrang = useNavigate()
  const them = useGioHang((s) => s.them)
  const thongBao = useThongBao((s) => s.hien)
  const { duLieu: sanPhamChiTiet, loi } = useTaiDuLieu<SanPhamChiTiet>(`/san-pham/${id}`)
  const { duLieu: cungLoai } = useTaiDuLieu<KetQuaDanhSachSanPham>(sanPhamChiTiet ? '/san-pham' : null, { danhMuc: sanPhamChiTiet?.danhMuc.id, soLuong: 12 })
  const sanPhamCungLoai = (cungLoai?.duLieu ?? []).filter((x) => x.id !== sanPhamChiTiet?.id)

  const dsRef = useRef<HTMLDivElement>(null)
  const cuonDanhSach = (huong: 1 | -1) => {
    const el = dsRef.current
    if (!el) return
    el.scrollBy({ left: huong * el.clientWidth, behavior: 'smooth' })
  }

  if (loi)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <TrangTrong>
          Không tìm thấy sản phẩm này.{' '}
          <Link to="/san-pham" className="font-semibold text-brand">
            Quay lại danh sách
          </Link>
        </TrangTrong>
      </div>
    )

  if (!sanPhamChiTiet) return null

  const themVaoGio = () => {
    them(sanPhamChiTiet, soLuong)
    thongBao('Đã thêm vào giỏ hàng', `${sanPhamChiTiet.ten} × ${soLuong}`)
  }

  const muaNgay = () => {
    them(sanPhamChiTiet, soLuong)
    chuyenTrang('/gio-hang')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-sm text-muted" aria-label="Điều hướng">
        <Link to="/san-pham" className="hover:text-ink">
          Sản phẩm
        </Link>{' '}
        / <span>{sanPhamChiTiet.danhMuc.ten}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ThuVienAnh key={sanPhamChiTiet.id} product={sanPhamChiTiet} />
        <div>
          <p className="font-semibold text-brand">{sanPhamChiTiet.thuongHieu}</p>
          <h1 className="mt-1 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{sanPhamChiTiet.ten}</h1>
          <div className="mt-5">
            <GiaSanPham product={sanPhamChiTiet} big />
          </div>
          <div className="mt-2">
            <GhiChuTonKho soLuong={sanPhamChiTiet.tonKho} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-13 items-center rounded-md bg-surface">
              <button aria-label="Giảm số lượng" onClick={() => setSoLuong((truoc) => Math.max(1, truoc - 1))} className="h-full w-12 text-xl hover:bg-surface-2">
                −
              </button>
              <span className="w-10 text-center font-semibold" aria-live="polite">
                {soLuong}
              </span>
              <button aria-label="Tăng số lượng" onClick={() => setSoLuong((truoc) => Math.min(sanPhamChiTiet.tonKho, truoc + 1))} className="h-full w-12 text-xl hover:bg-surface-2">
                +
              </button>
            </div>
            <Nut size="lg" variant="soft" onClick={themVaoGio} disabled={sanPhamChiTiet.tonKho === 0}>
              Thêm vào giỏ
            </Nut>
            <Nut size="lg" onClick={muaNgay} disabled={sanPhamChiTiet.tonKho === 0}>
              Mua ngay
            </Nut>
          </div>
          <button onClick={show} className="mt-4 font-semibold text-brand hover:underline">
            Hỏi trợ lý về sản phẩm này
          </button>

          <ul className="mt-8 space-y-2 rounded-lg bg-surface p-5 text-[15px]">
            <li>Hàng chính hãng, bảo hành {sanPhamChiTiet.soThangBaoHanh} tháng</li>
            <li>Miễn phí giao hàng cho đơn từ 5 triệu</li>
            <li>Đổi trả trong 10 ngày nếu lỗi nhà sản xuất</li>
          </ul>
        </div>
      </div>

      <section className="mt-16 max-w-3xl" aria-labelledby="specs">
        <h2 id="specs" className="text-2xl font-extrabold tracking-tight">
          Thông số kỹ thuật
        </h2>
        <table className="mt-5 w-full overflow-hidden rounded-lg bg-surface">
          <tbody>
            {Object.entries(sanPhamChiTiet.thongSo ?? {}).map(([k, v], i) => (
              <tr key={k} className={i % 2 ? 'bg-white' : ''}>
                <th scope="row" className={`${td} w-2/5 border-0 text-left font-semibold text-muted`}>
                  {k}
                </th>
                <td className={`${td} border-0`}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {sanPhamCungLoai.length > 0 && (
        <section className="mt-20" aria-labelledby="rel">
          <h2 id="rel" className="text-2xl font-extrabold tracking-tight">
            Sản phẩm cùng loại
          </h2>
          <div className="relative">
            <button type='button' aria-label='Trước' onClick={() => cuonDanhSach(-1)}
              className="absolute top-1/2 -left-7 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow md:block">
              ‹
            </button>
            <div ref={dsRef} className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2 sm:gap-5">
              {sanPhamCungLoai.map((r) => (
                <div key={r.id} className="w-[calc(50%-6px)] shrink-0 snap-start sm:w-[calc(25%-15px)]">
                  <TheSanPham key={r.id} product={r} />
                </div>
              ))}
            </div>
            <button type='button' aria-label='Sau' onClick={() => cuonDanhSach(1)}
              className="absolute top-1/2 -right-7 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow md:block">
              ›
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
