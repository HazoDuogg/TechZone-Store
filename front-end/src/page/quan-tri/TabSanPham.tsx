import { useState } from 'react'
import { Nhan, Nut, OChon, TrangTrong } from '../../components/GiaoDienCoBan'
import { AnhSanPham } from '../../components/SanPham'
import PhanTrang from '../../components/PhanTrang'
import { NhanTonKho } from '../nhan-vien/SanPhamVaTonKho'
import api from '../../lib/api'
import { tienVND } from '../../lib/dinhDang'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { layThongBaoLoi } from '../../lib/thongBaoLoi'
import { useDebounce } from '../../hooks/useDebounce'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useThongBao } from '../../store/thongBao'
import { CAC_TRANG_THAI_SAN_PHAM, NHAN_TRANG_THAI_SAN_PHAM } from '../../constants'
import type { DanhMucDayDu, KetQuaPhanTrang, SanPhamQuanTri } from '../../types'
import HopThoaiSanPham from './FormSanPham'

const MAU_TRANG_THAI = { dang_ban: 'green', cho_bo_sung: 'amber', ngung_ban: 'gray' } as const

export default function TabSanPham() {
  const [tuKhoa, setTuKhoa] = useState('')
  const [danhMuc, setDanhMuc] = useState('')
  const [trangThai, setTrangThai] = useState('')
  const [trang, setTrang] = useState(1)
  const [dangSua, setDangSua] = useState<number | 'moi' | null>(null)
  const hienThongBao = useThongBao((s) => s.hien)
  const tuKhoaTre = useDebounce(tuKhoa.trim(), 300)

  const { duLieu: cacDanhMuc = [] } = useTaiDuLieu<DanhMucDayDu[]>('/danh-muc')
  const {
    duLieu: ketQua,
    loi: loiTai,
    taiLai,
  } = useTaiDuLieu<KetQuaPhanTrang<SanPhamQuanTri>>('/san-pham/quan-tri', {
    query: tuKhoaTre || undefined,
    danhMuc: danhMuc || undefined,
    trangThai: trangThai || undefined,
    trang,
    soLuong: 20,
  })
  const dsSanPham = ketQua?.duLieu ?? []

  async function doiTrangThai(sanPham: SanPhamQuanTri) {
    const ngungBan = sanPham.trangThai === 'dang_ban'
    if (ngungBan && !window.confirm(`Ngừng bán ${sanPham.ten}? Khách sẽ không còn thấy sản phẩm này.`)) return
    try {
      await api.patch(`/san-pham/${sanPham.id}`, { trangThai: ngungBan ? 'ngung_ban' : 'dang_ban' })
      taiLai()
    } catch (err) {
      hienThongBao('Không đổi được trạng thái', layThongBaoLoi(err))
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          placeholder="Tìm theo tên hoặc thương hiệu"
          aria-label="Tìm sản phẩm"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.currentTarget.value)
            setTrang(1)
          }}
          className="h-11 w-full rounded-md bg-white px-3 focus:outline-2 focus:outline-brand sm:w-72"
        />
        <OChon
          aria-label="Lọc theo danh mục"
          value={danhMuc}
          onChange={(e) => {
            setDanhMuc(e.currentTarget.value)
            setTrang(1)
          }}
          className="w-44"
        >
          <option value="">Mọi danh mục</option>
          {cacDanhMuc.map((dm) => (
            <option key={dm.id} value={dm.id}>
              {dm.ten}
            </option>
          ))}
        </OChon>
        <OChon
          aria-label="Lọc theo trạng thái"
          value={trangThai}
          onChange={(e) => {
            setTrangThai(e.currentTarget.value)
            setTrang(1)
          }}
          className="w-44"
        >
          <option value="">Mọi trạng thái</option>
          {CAC_TRANG_THAI_SAN_PHAM.map((tt) => (
            <option key={tt} value={tt}>
              {NHAN_TRANG_THAI_SAN_PHAM[tt]}
            </option>
          ))}
        </OChon>
        <Nut className="ml-auto" onClick={() => setDangSua('moi')}>
          Thêm sản phẩm
        </Nut>
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
                  <th className={th}>Sản phẩm</th>
                  <th className={th}>Danh mục</th>
                  <th className={th}>Giá</th>
                  <th className={th}>Tồn</th>
                  <th className={th}>Trạng thái</th>
                  <th className={th}>
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dsSanPham.map((sp) => (
                  <tr key={sp.id}>
                    <td className={cx(td, 'min-w-64')}>
                      <div className="flex items-center gap-3">
                        <AnhSanPham product={sp} className="size-12 shrink-0 rounded-md p-1 [&_span]:hidden" />
                        <div>
                          <div className="font-semibold">{sp.ten}</div>
                          <div className="text-sm text-muted">{sp.thuongHieu}</div>
                        </div>
                      </div>
                    </td>
                    <td className={td}>{sp.danhMuc.ten}</td>
                    <td className={cx(td, 'whitespace-nowrap')}>
                      {tienVND(sp.gia)}
                      {sp.giaNiemYet && <div className="text-sm text-muted line-through">{tienVND(sp.giaNiemYet)}</div>}
                    </td>
                    <td className={cx(td, 'whitespace-nowrap')}>
                      <div className="grid grid-cols-[32px_1fr] items-center gap-2">
                        <span className="font-bold tabular-nums text-right">
                          {sp.tonKho}
                        </span>
                        <NhanTonKho n={sp.tonKho} />
                      </div>
                    </td>
                    <td className={cx(td, 'whitespace-nowrap')}>
                      <Nhan tone={MAU_TRANG_THAI[sp.trangThai]}>
                        {NHAN_TRANG_THAI_SAN_PHAM[sp.trangThai]}
                      </Nhan>
                    </td>
                    <td className={cx(td, 'whitespace-nowrap')}>
                      <Nut size="sm" variant="soft" onClick={() => setDangSua(sp.id)}>
                        Sửa
                      </Nut>{' '}
                      <Nut size="sm" variant={sp.trangThai === 'dang_ban' ? 'danger' : 'soft'} onClick={() => doiTrangThai(sp)}>
                        {sp.trangThai === 'dang_ban' ? 'Ngừng bán' : 'Mở bán'}
                      </Nut>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PhanTrang trang={ketQua.trang} tongTrang={ketQua.tongTrang} tong={ketQua.tong} donVi="sản phẩm" onDoiTrang={setTrang} />
        </>
      )}

      {dangSua !== null && (
        <HopThoaiSanPham
          idSanPham={dangSua}
          cacDanhMuc={cacDanhMuc}
          onDong={() => setDangSua(null)}
          onLuu={() => {
            setDangSua(null)
            taiLai()
          }}
        />
      )}
    </>
  )
}
