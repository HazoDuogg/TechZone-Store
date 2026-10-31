import { Link } from 'react-router-dom'
import { NutLienKet } from '../../components/GiaoDienCoBan'
import { TheSanPham, AnhSanPham } from '../../components/SanPham'
import { dsDanhMuc, dsSanPham } from '../../data/duLieuMau'
import { useTroLy } from '../../store/troLy'

const policies = [
  ['Hàng chính hãng', 'Mọi sản phẩm có hóa đơn VAT và tem bảo hành của nhà phân phối.'],
  ['Miễn phí giao hàng', 'Đơn từ 5 triệu đồng được giao miễn phí toàn quốc, nội thành nhận trong 2 đến 4 giờ.'],
  ['Đổi trả trong 10 ngày', 'Lỗi do nhà sản xuất được đổi mới, không cần giữ hộp nếu sản phẩm còn nguyên vẹn.'],
  ['Mua không cần tài khoản', 'Điền thông tin giao hàng và thanh toán ngay. Tra cứu đơn bằng mã đơn và số điện thoại.'],
]

export default function TrangChu() {
  const show = useTroLy((s) => s.show)
  const hero = dsSanPham.find((p) => p.id === 'vga-4060') ?? dsSanPham[0]
  const sale = dsSanPham.filter((p) => p.oldPrice).slice(0, 4)
  const fresh = dsSanPham.filter((p) => ['cpu-7600', 'ram-d5-32', 'ssd-980pro', 'mon-dell27'].includes(p.id))

  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-4 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_1fr]">
        <div className="rise">
          <h1 className="text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] font-extrabold tracking-tight">
            Chọn đúng linh kiện, lắp đúng cấu hình.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            TechZone bán linh kiện máy tính chính hãng. Nhập ngân sách, trợ lý của chúng tôi chọn sẵn bộ linh kiện tương thích với nhau và báo tổng tiền ngay.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NutLienKet to="/build-pc" size="lg">Build PC theo ngân sách</NutLienKet>
            <NutLienKet to="/san-pham" size="lg" variant="soft">Xem sản phẩm</NutLienKet>
          </div>
        </div>
        <Link to={`/san-pham/${hero.id}`} className="rise block overflow-hidden rounded-xl" style={{ animationDelay: '90ms' }} aria-label={hero.name}>
          <AnhSanPham product={hero} className="aspect-5/4 p-8 sm:p-10 [&_span:nth-child(2)]:text-[clamp(3rem,9vw,6.5rem)]" />
        </Link>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6" aria-labelledby="cats">
        <h2 id="cats" className="text-3xl font-extrabold tracking-tight sm:text-4xl">Danh mục</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {dsDanhMuc.map((c) => (
            <Link
              key={c}
              to="/san-pham"
              className="group flex min-h-28 flex-col justify-between rounded-lg bg-surface p-4 transition-colors hover:bg-brand hover:text-white"
            >
              <span className="text-xl font-bold">{c}</span>
              <span className="text-sm text-muted group-hover:text-white/80">{dsSanPham.filter((p) => p.category === c).length} sản phẩm</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6" aria-labelledby="sale">
        <div className="flex items-end justify-between gap-4">
          <h2 id="sale" className="text-3xl font-extrabold tracking-tight sm:text-4xl">Đang giảm giá</h2>
          <Link to="/san-pham" className="font-semibold text-brand hover:underline">Xem tất cả</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {sale.map((p) => <TheSanPham key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mt-24 bg-brand text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">Hỏi trợ lý trước khi bạn chọn.</h2>
            <p className="mt-5 max-w-lg text-lg text-white/85">
              Tư vấn linh kiện theo nhu cầu, so sánh hai sản phẩm cạnh nhau, viết sẵn mô tả. Trợ lý trả lời ngay trên website, không cần chờ nhân viên.
            </p>
            <button onClick={show} className="mt-8 h-13 rounded-md bg-white px-7 font-semibold text-brand-dark hover:bg-brand-soft">
              Mở trợ lý TechZone
            </button>
          </div>
          <div className="space-y-3 text-[15px]">
            <p className="w-fit max-w-[90%] rounded-lg bg-white/15 px-4 py-3">Mình có 9 triệu, nên mua card đồ họa nào để chơi game 1080p?</p>
            <p className="ml-auto w-fit max-w-[90%] rounded-lg bg-white px-4 py-3 text-ink">
              Với 9 triệu, <b>MSI RTX 4060 VENTUS 2X 8GB</b> chạy tốt hầu hết game ở 1080p, mức tiêu thụ 115W nên nguồn 550W là đủ.
            </p>
            <p className="w-fit max-w-[90%] rounded-lg bg-white/15 px-4 py-3">So sánh với RX 7600 giúp mình.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6" aria-labelledby="fresh">
        <h2 id="fresh" className="text-3xl font-extrabold tracking-tight sm:text-4xl">Được chọn nhiều</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {fresh.map((p) => <TheSanPham key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6" aria-labelledby="policy">
        <h2 id="policy" className="text-3xl font-extrabold tracking-tight sm:text-4xl">Mua sắm yên tâm</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {policies.map(([t, d]) => (
            <div key={t} className="rounded-lg bg-surface p-6">
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="mt-2 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
