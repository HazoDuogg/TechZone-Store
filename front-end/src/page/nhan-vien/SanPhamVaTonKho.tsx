import { Fragment, useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, OChon, TrangTrong } from '../../components/GiaoDienCoBan'
import PhanTrang from '../../components/PhanTrang'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { tienVND } from '../../lib/dinhDang'
import { useDebounce } from '../../hooks/useDebounce'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { CAC_TRANG_THAI_SAN_PHAM, NHAN_TRANG_THAI_SAN_PHAM } from '../../constants'
import type { DanhMucDayDu, KetQuaPhanTrang, SanPhamQuanTri } from '../../types'

export function NhanTonKho({ n }: { n: number }) {
  if (n === 0) return <Nhan tone="red">Hết hàng</Nhan>
  if (n < 5) return <Nhan tone="amber">Sắp hết</Nhan>
  return <Nhan tone="green">Còn hàng</Nhan>
}

export default function SanPhamVaTonKho() {
  const [tuKhoa, setTuKhoa] = useState('')
  const [danhMuc, setDanhMuc] = useState('')
  const [trangThai, setTrangThai] = useState('dang_ban')
  const [trang, setTrang] = useState(1)
  const [dangMo, setDangMo] = useState<number | null>(null)
  const tuKhoaTre = useDebounce(tuKhoa.trim(), 300)

  const { duLieu: cacDanhMuc = [] } = useTaiDuLieu<DanhMucDayDu[]>('/danh-muc')
  const { duLieu: ketQua, loi: loiTai } = useTaiDuLieu<KetQuaPhanTrang<SanPhamQuanTri>>('/san-pham/ton-kho', {
    query: tuKhoaTre || undefined,
    danhMuc: danhMuc || undefined,
    trangThai: trangThai || undefined,
    trang,
    soLuong: 20,
  })
  const dsSanPham = ketQua?.duLieu ?? []

  return (
    <>
      <TieuDeTrang title="Sản phẩm và tồn kho" desc="Tra cứu nhanh giá bán, thông số và số lượng còn để tư vấn cho khách. Bấm vào một dòng để xem thông số." />
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Tìm theo tên hoặc thương hiệu"
          aria-label="Tìm sản phẩm"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.currentTarget.value)
            setTrang(1)
          }}
          className="h-11 min-w-0 flex-1 rounded-md bg-white px-3 text-[15px] focus:outline-2 focus:outline-brand sm:max-w-md"
        />
        <OChon
          aria-label="Lọc theo danh mục"
          value={danhMuc}
          onChange={(e) => {
            setDanhMuc(e.currentTarget.value)
            setTrang(1)
          }}
          className="w-48 [&_select]:bg-white"
        >
          <option value="">Mọi danh mục</option>
          {cacDanhMuc.map((dm) => (
            <option key={dm.id} value={dm.id}>
              {dm.ten}
            </option>
          ))}
        </OChon>
        <OChon
          aria-label="Lọc theo trạng thái bán"
          value={trangThai}
          onChange={(e) => {
            setTrangThai(e.currentTarget.value)
            setTrang(1)
          }}
          className="w-48 [&_select]:bg-white"
        >
          <option value="">Mọi trạng thái</option>
          {CAC_TRANG_THAI_SAN_PHAM.map((tt) => (
            <option key={tt} value={tt}>
              {NHAN_TRANG_THAI_SAN_PHAM[tt]}
            </option>
          ))}
        </OChon>
      </div>

      {loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : !ketQua ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : dsSanPham.length === 0 ? (
        <TrangTrong>Không có sản phẩm nào.</TrangTrong>
      ) : (
        <>
          <div className={cx(tableWrap, 'bg-white')}>
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>Mã</th>
                  <th className={th}>Sản phẩm</th>
                  <th className={th}>Danh mục</th>
                  <th className={th}>Giá bán</th>
                  <th className={th}>Tồn</th>
                  <th className={th}>Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                {dsSanPham.map((sp) => (
                  <Fragment key={sp.id}>
                    <tr onClick={() => setDangMo(dangMo === sp.id ? null : sp.id)} aria-expanded={dangMo === sp.id} className="cursor-pointer hover:bg-surface">
                      <td className={cx(td, 'text-sm text-muted')}>{sp.id}</td>
                      <td className={cx(td, 'min-w-64')}>
                        <div className="font-medium">{sp.ten}</div>
                        <div className="text-sm text-muted">{sp.thuongHieu}</div>
                      </td>
                      <td className={td}>{sp.danhMuc.ten}</td>
                      <td className={cx(td, 'whitespace-nowrap')}>
                        {tienVND(sp.gia)}
                        {sp.giaNiemYet && <div className="text-sm text-muted line-through">{tienVND(sp.giaNiemYet)}</div>}
                      </td>
                      <td className={cx(td, 'font-bold tabular-nums')}>{sp.tonKho}</td>
                      <td className={td}>
                        <NhanTonKho n={sp.tonKho} />
                        {sp.trangThai !== 'dang_ban' && (
                          <div className="mt-1">
                            <Nhan tone="gray">{NHAN_TRANG_THAI_SAN_PHAM[sp.trangThai]}</Nhan>
                          </div>
                        )}
                      </td>
                    </tr>
                    {dangMo === sp.id && (
                      <tr>
                        <td colSpan={6} className="bg-surface px-4 py-3">
                          {sp.thongSo && Object.keys(sp.thongSo).length > 0 ? (
                            <dl className="grid gap-x-8 gap-y-1 text-[15px] sm:grid-cols-2">
                              {Object.entries(sp.thongSo).map(([ten, giaTri]) => (
                                <div key={ten}>
                                  <dt className="inline text-muted">{ten}: </dt>
                                  <dd className="inline font-medium">{giaTri}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : (
                            <p className="text-muted">Chưa có thông số cho sản phẩm này.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <PhanTrang trang={ketQua.trang} tongTrang={ketQua.tongTrang} tong={ketQua.tong} donVi="sản phẩm" onDoiTrang={setTrang} />
        </>
      )}
    </>
  )
}
