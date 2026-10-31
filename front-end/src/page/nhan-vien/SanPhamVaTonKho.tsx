import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, OChon } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsDanhMuc, dsSanPham, tonKho } from '../../data/duLieuMau'
import { tienVND } from '../../lib/dinhDang'

export function NhanTonKho({ n }: { n: number }) {
  if (n === 0) return <Nhan tone="red">Hết hàng</Nhan>
  if (n < 5) return <Nhan tone="amber">Sắp hết</Nhan>
  return <Nhan tone="green">Còn hàng</Nhan>
}

export default function SanPhamVaTonKho() {
  return (
    <>
      <TieuDeTrang title="Sản phẩm và tồn kho" desc="Tra cứu nhanh giá bán, thông số và số lượng còn để tư vấn cho khách." />
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Tìm theo tên hoặc mã sản phẩm"
          aria-label="Tìm sản phẩm"
          className="h-11 min-w-0 flex-1 rounded-md bg-white px-3 text-[15px] focus:outline-2 focus:outline-brand sm:max-w-md"
        />
        <OChon aria-label="Danh mục" className="w-48 [&_select]:bg-white">
          <option>Mọi danh mục</option>
          {dsDanhMuc.map((c) => <option key={c}>{c}</option>)}
        </OChon>
      </div>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr><th className={th}>Mã</th><th className={th}>Sản phẩm</th><th className={th}>Danh mục</th><th className={th}>Giá bán</th><th className={th}>Tồn</th><th className={th}>Tình trạng</th></tr>
          </thead>
          <tbody>
            {dsSanPham.map((p) => (
              <tr key={p.id}>
                <td className={cx(td, 'text-sm text-muted')}>{p.id}</td>
                <td className={cx(td, 'min-w-64 font-medium')}>{p.name}</td>
                <td className={td}>{p.category}</td>
                <td className={cx(td, 'whitespace-nowrap')}>{tienVND(p.price)}</td>
                <td className={cx(td, 'font-bold tabular-nums')}>{tonKho[p.id] ?? 0}</td>
                <td className={td}><NhanTonKho n={tonKho[p.id] ?? 0} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
