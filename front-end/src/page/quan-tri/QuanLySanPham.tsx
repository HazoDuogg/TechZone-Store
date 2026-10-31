import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nut, TruongNhap, HopThoai, OChon, ThanhTab } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsDanhMuc, dsSanPham, tonKho, type ThongTinSanPham } from '../../data/duLieuMau'
import { tienVND } from '../../lib/dinhDang'
import { NhanTonKho } from '../nhan-vien/SanPhamVaTonKho'
import VungTaiAnh from '../../components/VungTaiAnh'

const tabs = ['Sản phẩm', 'Danh mục'] as const

function TabSanPham() {
  const [edit, setEdit] = useState<ThongTinSanPham | 'new' | null>(null)
  const [del, setDel] = useState<ThongTinSanPham | null>(null)
  const cur = edit && edit !== 'new' ? edit : undefined

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input placeholder="Tìm sản phẩm" aria-label="Tìm sản phẩm" className="h-11 w-full rounded-md bg-white px-3 focus:outline-2 focus:outline-brand sm:w-80" />
        <div className="flex gap-2">
          <Nut variant="soft">Đồng bộ kho</Nut>
          <Nut onClick={() => setEdit('new')}>Thêm sản phẩm</Nut>
        </div>
      </div>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead><tr><th className={th}>Sản phẩm</th><th className={th}>Danh mục</th><th className={th}>Giá</th><th className={th}>Tồn</th><th className={th}><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>
            {dsSanPham.map((p) => (
              <tr key={p.id}>
                <td className={cx(td, 'min-w-64')}><div className="font-semibold">{p.name}</div><div className="text-sm text-muted">{p.brand}</div></td>
                <td className={td}>{p.category}</td>
                <td className={cx(td, 'whitespace-nowrap')}>{tienVND(p.price)}{p.oldPrice && <div className="text-sm text-muted line-through">{tienVND(p.oldPrice)}</div>}</td>
                <td className={td}><span className="mr-2 font-bold tabular-nums">{tonKho[p.id] ?? 0}</span><NhanTonKho n={tonKho[p.id] ?? 0} /></td>
                <td className={cx(td, 'whitespace-nowrap')}>
                  <Nut size="sm" variant="soft" onClick={() => setEdit(p)}>Sửa</Nut>{' '}
                  <Nut size="sm" variant="danger" onClick={() => setDel(p)}>Xóa</Nut>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <HopThoai title={cur ? 'Sửa sản phẩm' : 'Thêm sản phẩm'} onClose={() => setEdit(null)} wide>
          <form onSubmit={(e) => { e.preventDefault(); setEdit(null) }} className="space-y-4">
            <TruongNhap label="Tên sản phẩm" defaultValue={cur?.name} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TruongNhap label="Thương hiệu" defaultValue={cur?.brand} />
              <OChon label="Danh mục" defaultValue={cur?.category}>{dsDanhMuc.map((c) => <option key={c}>{c}</option>)}</OChon>
              <TruongNhap type="number" label="Giá bán (₫)" defaultValue={cur?.price} />
              <TruongNhap type="number" label="Giá niêm yết (₫)" defaultValue={cur?.oldPrice} hint="Để trống nếu không giảm giá" />
            </div>
            <VungTaiAnh label="Ảnh sản phẩm" multiple max={8} hint="Ảnh WebP, JPG hoặc PNG, khổ vuông 1200×1200, tối đa 8 ảnh. Ảnh đầu tiên là ảnh chính hiện ở danh sách." />
            <div className="flex justify-end gap-2 pt-2"><Nut type="button" variant="soft" onClick={() => setEdit(null)}>Hủy</Nut><Nut>Lưu</Nut></div>
          </form>
        </HopThoai>
      )}
      {del && (
        <HopThoai title="Xóa sản phẩm" onClose={() => setDel(null)}>
          <p>Xóa <b>{del.name}</b> khỏi cửa hàng? Thao tác này không thể hoàn tác.</p>
          <div className="mt-6 flex justify-end gap-2"><Nut variant="soft" onClick={() => setDel(null)}>Giữ lại</Nut><Nut variant="danger" onClick={() => setDel(null)}>Xóa</Nut></div>
        </HopThoai>
      )}
    </>
  )
}

function TabDanhMuc() {
  const [doiAnh, setDoiAnh] = useState<string | null>(null)
  return (
    <div className="max-w-xl">
      <form onSubmit={(e) => e.preventDefault()} className="mb-6 space-y-4 rounded-lg bg-white p-4">
        <TruongNhap label="Tên danh mục mới" />
        <VungTaiAnh label="Ảnh danh mục" hint="Ảnh WebP, JPG hoặc PNG, khổ vuông 400×400. Hiện ở ô danh mục trang chủ." />
        <Nut>Thêm danh mục</Nut>
      </form>
      <ul className="space-y-2">
        {dsDanhMuc.map((c) => (
          <li key={c} className="flex items-center justify-between gap-3 rounded-lg bg-white p-3">
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-md bg-surface text-xs font-semibold text-muted">Chưa có ảnh</span>
              <span className="font-semibold">{c} <span className="font-normal text-muted">· {dsSanPham.filter((p) => p.category === c).length} sản phẩm</span></span>
            </span>
            <span className="flex gap-1">
              <Nut size="sm" variant="soft" onClick={() => setDoiAnh(c)}>Đổi ảnh</Nut>
              <Nut size="sm" variant="soft">Đổi tên</Nut>
              <Nut size="sm" variant="danger">Xóa</Nut>
            </span>
          </li>
        ))}
      </ul>
      {doiAnh && (
        <HopThoai title={`Ảnh danh mục ${doiAnh}`} onClose={() => setDoiAnh(null)}>
          <form onSubmit={(e) => { e.preventDefault(); setDoiAnh(null) }} className="space-y-4">
            <VungTaiAnh label="Ảnh danh mục" hint="Ảnh WebP, JPG hoặc PNG, khổ vuông 400×400." />
            <div className="flex justify-end gap-2 pt-2"><Nut type="button" variant="soft" onClick={() => setDoiAnh(null)}>Hủy</Nut><Nut>Lưu</Nut></div>
          </form>
        </HopThoai>
      )}
    </div>
  )
}

export default function QuanLySanPham() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Sản phẩm')
  return (
    <>
      <TieuDeTrang title="Quản lý sản phẩm" desc="Thêm, sửa, xóa sản phẩm và sắp xếp danh mục." />
      <div className="mb-6"><ThanhTab value={tab} onChange={setTab} items={tabs} /></div>
      {tab === 'Sản phẩm' ? <TabSanPham /> : <TabDanhMuc />}
    </>
  )
}
