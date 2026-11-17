import { useState } from 'react'
import { OChon } from '../../components/GiaoDienCoBan'
import { cx } from '../../lib/lopCss'
import { TheSanPham } from '../../components/SanPham'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useSearchParams } from 'react-router-dom'
import type { DanhMuc, KetQuaDanhSachSanPham } from '../../types'


const KHOANG_GIA = [
  { nhan: 'Tất cả mức giá' },
  { nhan: 'Dưới 2 triệu', giaDen: 1999999 },
  { nhan: '2 - 5 triệu', giaTu: 2000000, giaDen: 4999999 },
  { nhan: '5 - 10 triệu', giaTu: 5000000, giaDen: 9999999 },
  { nhan: 'Trên 10 triệu', giaTu: 10000000 }
]

export default function DanhSachSanPham() {
  const [thamSo, setThamSo] = useSearchParams()
  const tuKhoa = thamSo.get('query') ?? ''
  const [khoangGia, setKhoangGia] = useState(0)
  const [thuongHieu, setThuongHieu] = useState('')
  const [danhMucDangChon, setDanhMucDangChon] = useState<number | null>(null)
  const chip = (active: boolean) => cx('rounded-md px-3 py-2 text-left text-[15px] font-medium transition-colors', active ? 'bg-brand text-white' : 'bg-surface hover:bg-surface-2')

  const khoang = KHOANG_GIA[khoangGia]
  const { duLieu: dsDanhMuc = [] } = useTaiDuLieu<DanhMuc[]>('/danh-muc')
  const { duLieu: dsThuongHieu = [] } = useTaiDuLieu<string[]>('/san-pham/thuong-hieu', { danhMuc: danhMucDangChon ?? undefined })
  const { duLieu: ketQua, loi } = useTaiDuLieu<KetQuaDanhSachSanPham>('/san-pham', {
    soLuong: 50,
    danhMuc: danhMucDangChon ?? undefined,
    thuongHieu: thuongHieu || undefined,
    giaTu: khoang.giaTu,
    giaDen: khoang.giaDen,
    query: tuKhoa || undefined,
  })
  const dsSanPham = ketQua?.duLieu ?? []
  const tong = ketQua?.tong ?? 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight break-words sm:text-4xl">
          {tuKhoa ? (
            <>
              Kết quả tìm kiếm cho <span className="text-danger">“{tuKhoa}”</span>
            </>
          ) : (
            (dsDanhMuc.find((d) => d.id === danhMucDangChon)?.ten ?? 'Tất cả sản phẩm')
          )}
        </h1>
        {ketQua && (
          <p className="mt-2 text-muted">
            <span className="font-semibold text-ink">{tong}</span> sản phẩm
          </p>
        )}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-6">
          <div>
            <h2 className="mb-2 font-bold">Danh mục</h2>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              <button className={chip(danhMucDangChon === null)} onClick={() => { setDanhMucDangChon(null); setThuongHieu(''); setKhoangGia(0); setThamSo({}) }}>
                Tất cả
              </button>
              {dsDanhMuc.map((c) => (
                <button key={c.id} className={chip(danhMucDangChon === c.id)} onClick={() => { setDanhMucDangChon(c.id); setThuongHieu(''); setThamSo({}) }}>
                  {c.ten}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <OChon label="Thương hiệu" value={thuongHieu} onChange={(e) => setThuongHieu(e.currentTarget.value)}>
              <option value="">Tất cả thương hiệu</option>
              {dsThuongHieu.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </OChon>
            <OChon label="Khoảng giá" value={khoangGia} onChange={(e) => setKhoangGia(Number(e.currentTarget.value))}>
              {KHOANG_GIA.map((k, i) => (
                <option key={i} value={i}>
                  {k.nhan}
                </option>
              ))}
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
          {!ketQua && !loi ? (
            <p className="text-muted">Đang tải sản phẩm...</p>
          ) : loi ? (
            <p className="font-semibold text-danger">{loi}</p>
          ) : tong === 0 ? (
            <p className="text-muted">Không có sản phẩm nào.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
              {dsSanPham.map((p) => (
                <TheSanPham key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
