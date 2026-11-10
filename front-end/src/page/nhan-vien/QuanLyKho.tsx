import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, VungNhap, OChon, ThanhTab } from '../../components/GiaoDienCoBan'
import OChonTimKiem from '../../components/OChonTimKiem'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsDanhMuc, dsHangChoMoBan, dsSanPham, tonKho } from '../../data/duLieuMau'
import { boDau, ngayGioVN } from '../../lib/dinhDang'
import { NhanTonKho } from './SanPhamVaTonKho'

const CAC_TAB = ['Nhập kho', 'Xuất kho', 'Kiểm kê'] as const

type DongLichSu = { thoiGian: string; tenSanPham: string; soLuong: number; ghiChu: string }

const layTenSanPham = (id: string) => dsSanPham.find((sp) => sp.id === id)?.name ?? id

const LICH_SU_MAU: DongLichSu[] = [
  { thoiGian: '25/10/2026 09:10', tenSanPham: layTenSanPham('ram-d5-32'), soLuong: 10, ghiChu: 'Phiếu nhập PN-0231' },
  { thoiGian: '24/10/2026 15:42', tenSanPham: layTenSanPham('ssd-980pro'), soLuong: 5, ghiChu: 'Phiếu nhập PN-0230' },
  { thoiGian: '22/10/2026 11:05', tenSanPham: layTenSanPham('cpu-7600'), soLuong: 8, ghiChu: 'Phiếu nhập PN-0229' },
]

const SAN_PHAM_MOI = 'moi'
const TEN_CAC_SAN_PHAM = [...dsSanPham.map((sp) => sp.name), ...dsHangChoMoBan.map((hang) => hang.name)]

type BieuMauProps = { loai: 'Nhập' | 'Xuất'; lichSu: DongLichSu[]; khiThem: (dong: DongLichSu) => void }

function BieuMauNhapXuat({ loai, lichSu, khiThem }: BieuMauProps) {
  const laNhap = loai === 'Nhập'
  const [sanPhamDuocChon, setSanPhamDuocChon] = useState<string | null>(null)
  const [tenSanPhamMoi, setTenSanPhamMoi] = useState('')
  const [thongBao, setThongBao] = useState('')
  const laSanPhamMoi = sanPhamDuocChon === SAN_PHAM_MOI

  const cacLuaChon = [
    ...(laNhap ? [{ value: SAN_PHAM_MOI, label: '＋ Sản phẩm mới', hint: 'Chưa có trong hệ thống' }] : []),
    ...dsHangChoMoBan.map((hang) => ({ value: hang.id, label: hang.name, hint: `Chờ mở bán · tồn ${hang.soLuongKho}` })),
    ...dsSanPham.map((sp) => ({ value: sp.id, label: sp.name, hint: `${sp.category} · tồn ${tonKho[sp.id] ?? 0}` })),
  ]

  const tenDangGo = boDau(tenSanPhamMoi.trim())
  const cacTenTuongTu = laSanPhamMoi && tenDangGo.length >= 3 ? TEN_CAC_SAN_PHAM.filter((ten) => boDau(ten).includes(tenDangGo)).slice(0, 3) : []

  const xuLyGui = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const duLieuForm = new FormData(e.currentTarget)
    const soLuong = Number(duLieuForm.get('soLuong')) || 1
    const ghiChu = String(duLieuForm.get('ghiChu') ?? '').trim()
    const maPhieu = `${laNhap ? 'PN' : 'PX'}-${String(229 + lichSu.length).padStart(4, '0')}`
    const tenSanPham = laSanPhamMoi ? tenSanPhamMoi.trim() : (cacLuaChon.find((luaChon) => luaChon.value === sanPhamDuocChon)?.label ?? '')
    khiThem({
      thoiGian: ngayGioVN(new Date().toISOString()),
      tenSanPham,
      soLuong,
      ghiChu: `Phiếu ${laNhap ? 'nhập' : 'xuất'} ${maPhieu}${ghiChu ? ` · ${ghiChu}` : ''}`,
    })
    e.currentTarget.reset()
    setSanPhamDuocChon(null)
    setTenSanPhamMoi('')
    setThongBao(`Đã ${laNhap ? 'nhập' : 'xuất'} ${soLuong} sản phẩm, ${maPhieu}`)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form onSubmit={xuLyGui} onChange={() => thongBao && setThongBao('')} className="h-fit space-y-4 rounded-xl bg-white p-5">
        <OChonTimKiem label="Sản phẩm" options={cacLuaChon} value={sanPhamDuocChon} onChange={setSanPhamDuocChon} placeholder="Gõ tên để tìm sản phẩm" />
        {laSanPhamMoi && (
          <>
            <TruongNhap
              label="Tên sản phẩm mới"
              value={tenSanPhamMoi}
              onChange={(e) => setTenSanPhamMoi(e.target.value)}
              required
              placeholder="Ví dụ: ASUS TUF RTX 4070 Ti SUPER 16GB"
            />
            {cacTenTuongTu.length > 0 && (
              <div role="status" className="rounded-md bg-warn/12 px-3 py-2 text-sm text-warn">
                Đã có sản phẩm tương tự: {cacTenTuongTu.join('; ')}. Hãy chọn sản phẩm đã có nếu là cùng một mặt hàng.
              </div>
            )}
            <TruongNhap name="thuongHieu" label="Thương hiệu" required />
            <OChon name="danhMuc" label="Danh mục" required defaultValue="">
              <option value="" disabled>
                Chọn danh mục
              </option>
              {dsDanhMuc.map((danhMuc) => (
                <option key={danhMuc}>{danhMuc}</option>
              ))}
            </OChon>
          </>
        )}
        <TruongNhap name="soLuong" type="number" min={1} defaultValue={1} label="Số lượng" />
        {laNhap && <VungNhap name="serial" label="Số serial từng chiếc" placeholder="Mỗi dòng một serial, số dòng bằng số lượng nhập" />}
        <TruongNhap name="ghiChu" label="Ghi chú" placeholder={laNhap ? 'Số phiếu nhập, nhà cung cấp' : 'Lý do xuất'} />
        {thongBao && (
          <p role="status" className="rounded-md bg-ok/12 px-3 py-2 text-sm font-semibold text-ok">
            {thongBao}
          </p>
        )}
        <Nut className="w-full" disabled={!sanPhamDuocChon}>
          {loai} kho
        </Nut>
      </form>
      <div>
        <h2 className="mb-3 font-bold">Lịch sử {loai.toLowerCase()} kho</h2>
        <div className={cx(tableWrap, 'bg-white')}>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Thời gian</th>
                <th className={th}>Sản phẩm</th>
                <th className={th}>SL</th>
                <th className={th}>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {lichSu.map((dong, viTri) => (
                <tr key={`${dong.thoiGian}-${viTri}`}>
                  <td className={cx(td, 'whitespace-nowrap')}>{dong.thoiGian}</td>
                  <td className={td}>{dong.tenSanPham}</td>
                  <td className={cx(td, 'font-bold tabular-nums')}>
                    {laNhap ? '+' : '−'}
                    {dong.soLuong}
                  </td>
                  <td className={cx(td, 'text-muted')}>{dong.ghiChu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function KiemKe() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">Nhập số lượng đếm thực tế để đối chiếu với tồn hệ thống.</p>
        <Nut>Ghi nhận kiểm kê</Nut>
      </div>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Sản phẩm</th>
              <th className={th}>Tồn hệ thống</th>
              <th className={th}>Thực tế</th>
              <th className={th}>Chênh lệch</th>
              <th className={th}>Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {dsSanPham.slice(0, 10).map((sp, viTri) => (
              <tr key={sp.id}>
                <td className={cx(td, 'min-w-64 font-medium')}>{sp.name}</td>
                <td className={cx(td, 'tabular-nums')}>{tonKho[sp.id] ?? 0}</td>
                <td className={td}>
                  <input
                    type="number"
                    min={0}
                    defaultValue={viTri === 2 ? (tonKho[sp.id] ?? 0) - 1 : ''}
                    aria-label={`Số lượng thực tế của ${sp.name}`}
                    className="h-9 w-24 rounded-md bg-surface px-2 focus:bg-white focus:outline-2 focus:outline-brand"
                  />
                </td>
                <td className={td}>{viTri === 2 ? <Nhan tone="red">−1</Nhan> : '—'}</td>
                <td className={td}>
                  <NhanTonKho n={tonKho[sp.id] ?? 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function QuanLyKho() {
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>('Nhập kho')
  const [lichSuNhap, setLichSuNhap] = useState(LICH_SU_MAU)
  const [lichSuXuat, setLichSuXuat] = useState(LICH_SU_MAU)
  return (
    <>
      <TieuDeTrang title="Quản lý kho" desc="Nhập hàng, xuất hàng và kiểm kê tồn kho trên cùng một màn hình." />
      <div className="mb-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>
      {tab === 'Nhập kho' && <BieuMauNhapXuat loai="Nhập" lichSu={lichSuNhap} khiThem={(dong) => setLichSuNhap((truoc) => [dong, ...truoc])} />}
      {tab === 'Xuất kho' && <BieuMauNhapXuat loai="Xuất" lichSu={lichSuXuat} khiThem={(dong) => setLichSuXuat((truoc) => [dong, ...truoc])} />}
      {tab === 'Kiểm kê' && <KiemKe />}
    </>
  )
}
