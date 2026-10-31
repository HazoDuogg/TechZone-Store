import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Nut, TrangTrong, NutLienKet } from '../../components/GiaoDienCoBan'
import { td } from '../../lib/lopCss'
import { GiaSanPham, TheSanPham, AnhSanPham, GhiChuTonKho } from '../../components/SanPham'
import { dsSanPham } from '../../data/duLieuMau'
import { useTroLy } from '../../store/troLy'

export default function ChiTietSanPham() {
  const { id } = useParams()
  const show = useTroLy((s) => s.show)
  const [qty, setQty] = useState(1)

  const p = dsSanPham.find((x) => x.id === id)
  if (!p)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <TrangTrong>Không tìm thấy sản phẩm này. <Link to="/san-pham" className="font-semibold text-brand">Quay lại danh sách</Link></TrangTrong>
      </div>
    )

  const related = dsSanPham.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-sm text-muted" aria-label="Điều hướng">
        <Link to="/san-pham" className="hover:text-ink">Sản phẩm</Link> / <span>{p.category}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <AnhSanPham product={p} className="aspect-square rounded-xl p-8 sm:p-12 [&_span:nth-child(2)]:text-[clamp(3rem,10vw,6rem)]" />
        <div>
          <p className="font-semibold text-brand">{p.brand}</p>
          <h1 className="mt-1 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{p.name}</h1>
          <div className="mt-5"><GiaSanPham product={p} big /></div>
          <div className="mt-2"><GhiChuTonKho id={p.id} /></div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-13 items-center rounded-md bg-surface">
              <button aria-label="Giảm số lượng" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-full w-12 text-xl hover:bg-surface-2">−</button>
              <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
              <button aria-label="Tăng số lượng" onClick={() => setQty((q) => q + 1)} className="h-full w-12 text-xl hover:bg-surface-2">+</button>
            </div>
            <Nut size="lg" variant="soft">Thêm vào giỏ</Nut>
            <NutLienKet to="/gio-hang" size="lg">Mua ngay</NutLienKet>
          </div>
          <button onClick={show} className="mt-4 font-semibold text-brand hover:underline">
            Hỏi trợ lý về sản phẩm này
          </button>

          <ul className="mt-8 space-y-2 rounded-lg bg-surface p-5 text-[15px]">
            <li>Hàng chính hãng, bảo hành 36 tháng</li>
            <li>Miễn phí giao hàng cho đơn từ 5 triệu</li>
            <li>Đổi trả trong 10 ngày nếu lỗi nhà sản xuất</li>
          </ul>
        </div>
      </div>

      <section className="mt-16 max-w-3xl" aria-labelledby="specs">
        <h2 id="specs" className="text-2xl font-extrabold tracking-tight">Thông số kỹ thuật</h2>
        <table className="mt-5 w-full overflow-hidden rounded-lg bg-surface">
          <tbody>
            {Object.entries(p.specs).map(([k, v], i) => (
              <tr key={k} className={i % 2 ? 'bg-white' : ''}>
                <th scope="row" className={`${td} w-2/5 border-0 text-left font-semibold text-muted`}>{k}</th>
                <td className={`${td} border-0`}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="rel">
          <h2 id="rel" className="text-2xl font-extrabold tracking-tight">Sản phẩm cùng loại</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((r) => <TheSanPham key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  )
}
