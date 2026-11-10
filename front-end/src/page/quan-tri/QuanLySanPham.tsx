import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nut, TruongNhap, VungNhap, HopThoai, OChon, ThanhTab } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsDanhMuc, dsHangChoMoBan, dsSanPham, tonKho } from '../../data/duLieuMau'
import type { ThongTinSanPham } from '../../types'
import { tienVND } from '../../lib/dinhDang'
import { NhanTonKho } from '../nhan-vien/SanPhamVaTonKho'
import VungTaiAnh from '../../components/VungTaiAnh'
import OChonTimKiem from '../../components/OChonTimKiem'
import { AnhSanPham } from '../../components/SanPham'
import { duongDanAnhDanhMuc } from '../../lib/duongDanAnh'

const CAC_TAB = ['Sản phẩm', 'Danh mục'] as const

function TabSanPham() {
  const [dangSua, setDangSua] = useState<ThongTinSanPham | 'moi' | null>(null)
  const [sanPhamCanXoa, setSanPhamCanXoa] = useState<ThongTinSanPham | null>(null)
  const [hangDuocChonId, setHangDuocChonId] = useState<string | null>(null)
  const [daMoBan, setDaMoBan] = useState<string[]>([])
  const sanPhamDangSua = dangSua && dangSua !== 'moi' ? dangSua : undefined
  const hangChoMoBan = dsHangChoMoBan.filter((hang) => !daMoBan.includes(hang.id))
  const hangDangChon = hangChoMoBan.find((hang) => hang.id === hangDuocChonId)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input placeholder="Tìm sản phẩm" aria-label="Tìm sản phẩm" className="h-11 w-full rounded-md bg-white px-3 focus:outline-2 focus:outline-brand sm:w-80" />
        <div className="flex gap-2">
          <Nut variant="soft">Đồng bộ kho</Nut>
          <Nut
            onClick={() => {
              setHangDuocChonId(null)
              setDangSua('moi')
            }}
          >
            Mở bán sản phẩm mới
          </Nut>
        </div>
      </div>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Sản phẩm</th>
              <th className={th}>Danh mục</th>
              <th className={th}>Giá</th>
              <th className={th}>Tồn</th>
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
                      <div className="font-semibold">{sp.name}</div>
                      <div className="text-sm text-muted">{sp.brand}</div>
                    </div>
                  </div>
                </td>
                <td className={td}>{sp.category}</td>
                <td className={cx(td, 'whitespace-nowrap')}>
                  {tienVND(sp.price)}
                  {sp.oldPrice && <div className="text-sm text-muted line-through">{tienVND(sp.oldPrice)}</div>}
                </td>
                <td className={td}>
                  <span className="mr-2 font-bold tabular-nums">{tonKho[sp.id] ?? 0}</span>
                  <NhanTonKho n={tonKho[sp.id] ?? 0} />
                </td>
                <td className={cx(td, 'whitespace-nowrap')}>
                  <Nut size="sm" variant="soft" onClick={() => setDangSua(sp)}>
                    Sửa
                  </Nut>{' '}
                  <Nut size="sm" variant="danger" onClick={() => setSanPhamCanXoa(sp)}>
                    Xóa
                  </Nut>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dangSua && (
        <HopThoai title={sanPhamDangSua ? 'Sửa sản phẩm' : 'Mở bán sản phẩm mới'} onClose={() => setDangSua(null)} wide>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!sanPhamDangSua && hangDuocChonId) setDaMoBan((truoc) => [...truoc, hangDuocChonId])
              setDangSua(null)
            }}
            className="space-y-4"
          >
            {sanPhamDangSua ? (
              <TruongNhap label="Tên sản phẩm" defaultValue={sanPhamDangSua.name} />
            ) : (
              <OChonTimKiem
                label="Sản phẩm đã nhập kho"
                options={hangChoMoBan.map((hang) => ({ value: hang.id, label: hang.name, hint: `${hang.brand} · ${hang.category} · ${hang.soLuongKho} chiếc trong kho` }))}
                value={hangDuocChonId}
                onChange={setHangDuocChonId}
                placeholder="Gõ tên để tìm sản phẩm"
                emptyText="Chưa có sản phẩm chờ mở bán. Nhờ nhân viên kho nhập hàng trước."
                hint="Chỉ hiện hàng đã nhập kho và chưa mở bán."
              />
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {sanPhamDangSua ? (
                <>
                  <TruongNhap label="Thương hiệu" defaultValue={sanPhamDangSua.brand} />
                  <OChon label="Danh mục" defaultValue={sanPhamDangSua.category}>
                    {dsDanhMuc.map((danhMuc) => (
                      <option key={danhMuc}>{danhMuc}</option>
                    ))}
                  </OChon>
                </>
              ) : (
                <>
                  <TruongNhap label="Thương hiệu" value={hangDangChon?.brand ?? ''} disabled placeholder="Tự điền khi chọn sản phẩm" />
                  <TruongNhap label="Danh mục" value={hangDangChon?.category ?? ''} disabled placeholder="Tự điền khi chọn sản phẩm" />
                </>
              )}
              <TruongNhap type="number" label="Giá bán (₫)" defaultValue={sanPhamDangSua?.price} />
              <TruongNhap type="number" label="Giá niêm yết (₫)" defaultValue={sanPhamDangSua?.oldPrice} hint="Để trống nếu không giảm giá" />
              <TruongNhap type="number" min={0} label="Bảo hành (tháng)" defaultValue={sanPhamDangSua ? 36 : undefined} />
              <TruongNhap type="number" min={0} label="Ngưỡng cảnh báo sắp hết" defaultValue={sanPhamDangSua ? 5 : undefined} hint="Cảnh báo khi tồn kho thấp hơn số này" />
              <OChon label="Trạng thái">
                <option>Đang bán</option>
                <option>Ẩn</option>
              </OChon>
            </div>
            <VungNhap label="Mô tả" />
            <VungNhap
              label="Thông số kỹ thuật"
              placeholder="Mỗi dòng một thông số, ví dụ: Socket: AM5"
              defaultValue={
                sanPhamDangSua
                  ? Object.entries(sanPhamDangSua.specs)
                      .map(([ten, giaTri]) => `${ten}: ${giaTri}`)
                      .join('\n')
                  : undefined
              }
            />
            <VungTaiAnh label="Ảnh sản phẩm" multiple max={8} hint="Ảnh WebP, JPG hoặc PNG, khổ vuông 1200×1200, tối đa 8 ảnh. Ảnh đầu tiên là ảnh chính hiện ở danh sách." />
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setDangSua(null)}>
                Hủy
              </Nut>
              <Nut disabled={!sanPhamDangSua && !hangDuocChonId}>Lưu</Nut>
            </div>
          </form>
        </HopThoai>
      )}
      {sanPhamCanXoa && (
        <HopThoai title="Xóa sản phẩm" onClose={() => setSanPhamCanXoa(null)}>
          <p>
            Xóa <b>{sanPhamCanXoa.name}</b> khỏi cửa hàng? Thao tác này không thể hoàn tác.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Nut variant="soft" onClick={() => setSanPhamCanXoa(null)}>
              Giữ lại
            </Nut>
            <Nut variant="danger" onClick={() => setSanPhamCanXoa(null)}>
              Xóa
            </Nut>
          </div>
        </HopThoai>
      )}
    </>
  )
}

function TabDanhMuc() {
  const [danhMucDoiAnh, setDanhMucDoiAnh] = useState<string | null>(null)
  return (
    <div className="max-w-xl">
      <form onSubmit={(e) => e.preventDefault()} className="mb-6 space-y-4 rounded-lg bg-white p-4">
        <TruongNhap label="Tên danh mục mới" />
        <VungTaiAnh label="Ảnh danh mục" hint="Ảnh WebP, JPG hoặc PNG, khổ vuông 400×400. Hiện ở ô danh mục trang chủ." />
        <Nut>Thêm danh mục</Nut>
      </form>
      <ul className="space-y-2">
        {dsDanhMuc.map((danhMuc) => (
          <li key={danhMuc} className="flex items-center justify-between gap-3 rounded-lg bg-white p-3">
            <span className="flex min-w-0 items-center gap-3">
              <img src={duongDanAnhDanhMuc(danhMuc)} alt="" className="size-12 shrink-0 rounded-md bg-surface object-cover" />
              <span className="font-semibold">
                {danhMuc} <span className="font-normal text-muted">· {dsSanPham.filter((sp) => sp.category === danhMuc).length} sản phẩm</span>
              </span>
            </span>
            <span className="flex gap-1">
              <Nut size="sm" variant="soft" onClick={() => setDanhMucDoiAnh(danhMuc)}>
                Đổi ảnh
              </Nut>
              <Nut size="sm" variant="soft">
                Đổi tên
              </Nut>
              <Nut size="sm" variant="danger">
                Xóa
              </Nut>
            </span>
          </li>
        ))}
      </ul>
      {danhMucDoiAnh && (
        <HopThoai title={`Ảnh danh mục ${danhMucDoiAnh}`} onClose={() => setDanhMucDoiAnh(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDanhMucDoiAnh(null)
            }}
            className="space-y-4"
          >
            <VungTaiAnh label="Ảnh danh mục" hint="Ảnh WebP, JPG hoặc PNG, khổ vuông 400×400." />
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setDanhMucDoiAnh(null)}>
                Hủy
              </Nut>
              <Nut>Lưu</Nut>
            </div>
          </form>
        </HopThoai>
      )}
    </div>
  )
}

export default function QuanLySanPham() {
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>('Sản phẩm')
  return (
    <>
      <TieuDeTrang title="Quản lý sản phẩm" desc="Thêm, sửa, xóa sản phẩm và sắp xếp danh mục." />
      <div className="mb-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>
      {tab === 'Sản phẩm' ? <TabSanPham /> : <TabDanhMuc />}
    </>
  )
}
