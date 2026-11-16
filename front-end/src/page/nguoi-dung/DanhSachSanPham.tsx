import { useEffect, useState } from 'react'
import { OChon } from '../../components/GiaoDienCoBan'
import { cx } from '../../lib/lopCss'
import { TheSanPham } from '../../components/SanPham'
import type { ThongTinSanPham } from '../../types'
import api from '../../lib/api'
import { useSearchParams } from 'react-router-dom'

type DanhSachSanPham = {
  id: number
  ten: string
  thuongHieu: string | null
  gia: number
  giaNiemYet: number | null
  thongSo: Record<string, string> | null
  danhMuc: { id: number; ten: string }
  anh: { duongDan: string }[]
  tonKho: number
}

type DanhMuc = {
  id: number
  ten: string
}

const KHOANG_GIA = [
  { nhan: 'Tất cả mức giá' },
  { nhan: 'Dưới 2 triệu', giaDen: 1999999 },
  { nhan: '2 - 5 triệu', giaTu: 2000000, giaDen: 4999999 },
  { nhan: '5 - 10 triệu', giaTu: 5000000, giaDen: 9999999 },
  { nhan: 'Trên 10 triệu', giaTu: 10000000 }
]

const chuyenSanPham = (sp: DanhSachSanPham): ThongTinSanPham => ({
  id: String(sp.id),
  name: sp.ten,
  brand: sp.thuongHieu ?? '',
  category: sp.danhMuc.ten,
  price: sp.gia,
  oldPrice: sp.giaNiemYet ?? undefined,
  specs: sp.thongSo ?? {},
  anh: sp.anh.map((a) => a.duongDan),
  tonKho: sp.tonKho,
})

export default function DanhSachSanPham() {
  const [thamSo, setThamSo] = useSearchParams()
  const tuKhoa = thamSo.get('query') ?? ''
  const [khoangGia, setKhoangGia] = useState(0)
  const [dsSanPham, setDsSanPham] = useState<ThongTinSanPham[]>([])
  const [dsthuongHieu, setDsThuongHieu] = useState<string[]>([])
  const [thuongHieu, setThuongHieu] = useState('')
  const [tong, setTong] = useState(0)
  const [dsMuc, setDsDanhMuc] = useState<DanhMuc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [danhMucDangChon, setDanhMucDangChon] = useState<number | null>(null)
  const chip = (active: boolean) => cx('rounded-md px-3 py-2 text-left text-[15px] font-medium transition-colors', active ? 'bg-brand text-white' : 'bg-surface hover:bg-surface-2')

  useEffect(() => {
    api.get<DanhMuc[]>('/danh-muc').then((res) => setDsDanhMuc(res.data))
  }, [])

  useEffect(() => {
    let huy = false
    api.get<string[]>('/san-pham/thuong-hieu', { params: { danhMuc: danhMucDangChon ?? undefined } })
      .then((res) => {
        if (!huy) {
          setDsThuongHieu(res.data)
        }
      })
    return () => {
      huy = true
    }
  }, [danhMucDangChon])

  useEffect(() => {
    let huy = false
    const khoang = KHOANG_GIA[khoangGia]
    api.get('/san-pham',
      {
        params: {
          soLuong: 50,
          danhMuc: danhMucDangChon ?? undefined,
          thuongHieu: thuongHieu || undefined,
          giaTu: khoang.giaTu,
          giaDen: khoang.giaDen,
          query: tuKhoa || undefined
        }
      }).then((res) => {
        if (huy) return
        setDsSanPham(res.data.duLieu.map(chuyenSanPham))
        setTong(res.data.tong)
        setError(null)
      })
      .catch(() => {
        if (!huy) {
          setError('Không tải được danh sách sản phẩm')
        }
      })
      .finally(() => {
        if (!huy) {
          setLoading(false)
        }
      })
    return () => {
      huy = true
    }
  }, [danhMucDangChon, thuongHieu, khoangGia, tuKhoa])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight break-words sm:text-4xl">
          {tuKhoa ? (
            <>
              Kết quả tìm kiếm cho <span className="text-danger">“{tuKhoa}”</span>
            </>
          ) : (
            (dsMuc.find((d) => d.id === danhMucDangChon)?.ten ?? 'Tất cả sản phẩm')
          )}
        </h1>
        {!loading && (
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
              <button className={chip(danhMucDangChon === null)} onClick={() => { setDanhMucDangChon(null); setThuongHieu(''); setThamSo({}) }}>
                Tất cả
              </button>
              {dsMuc.map((c) => (
                <button key={c.id} className={chip(danhMucDangChon === c.id)} onClick={() => { setDanhMucDangChon(c.id); setThuongHieu(''); setThamSo({}) }}>
                  {c.ten}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <OChon label="Thương hiệu" value={thuongHieu} onChange={(e) => setThuongHieu(e.currentTarget.value)}>
              <option value="">Tất cả thương hiệu</option>
              {dsthuongHieu.map((t) => (
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
          {loading ? (
            <p className="text-muted">Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="font-semibold text-danger">{error}</p>
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
