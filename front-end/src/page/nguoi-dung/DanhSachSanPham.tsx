import { useState } from 'react'
import { OChon } from '../../components/GiaoDienCoBan'
import { cx } from '../../lib/lopCss'
import { TheSanPham } from '../../components/SanPham'
import { dsDanhMuc, dsSanPham } from '../../data/duLieuMau'

export default function DanhSachSanPham() {
  const [cat, setCat] = useState('')

  const chip = (active: boolean) =>
    cx('rounded-md px-3 py-2 text-left text-[15px] font-medium transition-colors', active ? 'bg-brand text-white' : 'bg-surface hover:bg-surface-2')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{cat || 'Tất cả sản phẩm'}</h1>
      <p className="mt-1 text-muted">{dsSanPham.length} sản phẩm</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-6">
          <div>
            <h2 className="mb-2 font-bold">Danh mục</h2>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              <button className={chip(!cat)} onClick={() => setCat('')}>Tất cả</button>
              {dsDanhMuc.map((c) => (
                <button key={c} className={chip(cat === c)} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <OChon label="Thương hiệu">
              <option>Tất cả thương hiệu</option>
              <option>AMD</option>
              <option>Intel</option>
              <option>MSI</option>
              <option>ASUS</option>
            </OChon>
            <OChon label="Khoảng giá">
              <option>Tất cả mức giá</option>
              <option>Dưới 2 triệu</option>
              <option>2 - 5 triệu</option>
              <option>5 - 10 triệu</option>
              <option>Trên 10 triệu</option>
            </OChon>
          </div>
          <label className="flex items-center gap-2 text-[15px] font-medium">
            <input type="checkbox" className="size-4 accent-brand" />
            Chỉ hiện sản phẩm còn hàng
          </label>
        </aside>

        <div>
          <div className="mb-4 flex justify-end">
            <OChon aria-label="Sắp xếp" className="w-52">
              <option>Mới nhất</option>
              <option>Giá thấp đến cao</option>
              <option>Giá cao đến thấp</option>
            </OChon>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {dsSanPham.map((p) => <TheSanPham key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
