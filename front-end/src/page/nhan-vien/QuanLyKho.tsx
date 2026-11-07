import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, VungNhap, OChon, ThanhTab } from '../../components/GiaoDienCoBan'
import OChonTimKiem from '../../components/OChonTimKiem'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsDanhMuc, dsHangChoMoBan, dsSanPham, tonKho } from '../../data/duLieuMau'
import { boDau, ngayGioVN } from '../../lib/dinhDang'
import { NhanTonKho } from './SanPhamVaTonKho'

const tabs = ['Nhập kho', 'Xuất kho', 'Kiểm kê'] as const

type DongLichSu = { at: string; name: string; qty: number; note: string }

const tenSanPham = (id: string) => dsSanPham.find((p) => p.id === id)?.name ?? id

const lichSuMau: DongLichSu[] = [
  { at: '25/10/2026 09:10', name: tenSanPham('ram-d5-32'), qty: 10, note: 'Phiếu nhập PN-0231' },
  { at: '24/10/2026 15:42', name: tenSanPham('ssd-980pro'), qty: 5, note: 'Phiếu nhập PN-0230' },
  { at: '22/10/2026 11:05', name: tenSanPham('cpu-7600'), qty: 8, note: 'Phiếu nhập PN-0229' },
]

const SAN_PHAM_MOI = 'moi'
const tatCaTen = [...dsSanPham.map((p) => p.name), ...dsHangChoMoBan.map((h) => h.name)]

type BieuMauProps = { type: 'Nhập' | 'Xuất'; dong: DongLichSu[]; onThem: (d: DongLichSu) => void }

function BieuMauNhapXuat({ type, dong, onThem }: BieuMauProps) {
  const nhap = type === 'Nhập'
  const [chon, setChon] = useState<string | null>(null)
  const [ten, setTen] = useState('')
  const [thongBao, setThongBao] = useState('')
  const moi = chon === SAN_PHAM_MOI

  const luaChon = [
    ...(nhap ? [{ value: SAN_PHAM_MOI, label: '＋ Sản phẩm mới', hint: 'Chưa có trong hệ thống' }] : []),
    ...dsHangChoMoBan.map((h) => ({ value: h.id, label: h.name, hint: `Chờ mở bán · tồn ${h.soLuongKho}` })),
    ...dsSanPham.map((p) => ({ value: p.id, label: p.name, hint: `${p.category} · tồn ${tonKho[p.id] ?? 0}` })),
  ]

  const tenGo = boDau(ten.trim())
  const giong = moi && tenGo.length >= 3 ? tatCaTen.filter((n) => boDau(n).includes(tenGo)).slice(0, 3) : []

  const gui = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const qty = Number(f.get('soLuong')) || 1
    const ghiChu = String(f.get('ghiChu') ?? '').trim()
    const ma = `${nhap ? 'PN' : 'PX'}-${String(229 + dong.length).padStart(4, '0')}`
    const name = moi ? ten.trim() : luaChon.find((o) => o.value === chon)?.label ?? ''
    onThem({ at: ngayGioVN(new Date().toISOString()), name, qty, note: `Phiếu ${nhap ? 'nhập' : 'xuất'} ${ma}${ghiChu ? ` · ${ghiChu}` : ''}` })
    e.currentTarget.reset()
    setChon(null)
    setTen('')
    setThongBao(`Đã ${nhap ? 'nhập' : 'xuất'} ${qty} sản phẩm, ${ma}`)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form onSubmit={gui} onChange={() => thongBao && setThongBao('')} className="h-fit space-y-4 rounded-xl bg-white p-5">
        <OChonTimKiem label="Sản phẩm" options={luaChon} value={chon} onChange={setChon} placeholder="Gõ tên để tìm sản phẩm" />
        {moi && (
          <>
            <TruongNhap label="Tên sản phẩm mới" value={ten} onChange={(e) => setTen(e.target.value)} required placeholder="Ví dụ: ASUS TUF RTX 4070 Ti SUPER 16GB" />
            {giong.length > 0 && (
              <div role="status" className="rounded-md bg-warn/12 px-3 py-2 text-sm text-warn">
                Đã có sản phẩm tương tự: {giong.join('; ')}. Hãy chọn sản phẩm đã có nếu là cùng một mặt hàng.
              </div>
            )}
            <TruongNhap name="thuongHieu" label="Thương hiệu" required />
            <OChon name="danhMuc" label="Danh mục" required defaultValue="">
              <option value="" disabled>Chọn danh mục</option>
              {dsDanhMuc.map((c) => <option key={c}>{c}</option>)}
            </OChon>
          </>
        )}
        <TruongNhap name="soLuong" type="number" min={1} defaultValue={1} label="Số lượng" />
        {nhap && <VungNhap name="serial" label="Số serial từng chiếc" placeholder="Mỗi dòng một serial, số dòng bằng số lượng nhập" />}
        <TruongNhap name="ghiChu" label="Ghi chú" placeholder={nhap ? 'Số phiếu nhập, nhà cung cấp' : 'Lý do xuất'} />
        {thongBao && <p role="status" className="rounded-md bg-ok/12 px-3 py-2 text-sm font-semibold text-ok">{thongBao}</p>}
        <Nut className="w-full" disabled={!chon}>{type} kho</Nut>
      </form>
      <div>
        <h2 className="mb-3 font-bold">Lịch sử {type.toLowerCase()} kho</h2>
        <div className={cx(tableWrap, 'bg-white')}>
          <table className="w-full">
            <thead><tr><th className={th}>Thời gian</th><th className={th}>Sản phẩm</th><th className={th}>SL</th><th className={th}>Ghi chú</th></tr></thead>
            <tbody>
              {dong.map((m, i) => (
                <tr key={`${m.at}-${i}`}>
                  <td className={cx(td, 'whitespace-nowrap')}>{m.at}</td>
                  <td className={td}>{m.name}</td>
                  <td className={cx(td, 'font-bold tabular-nums')}>{nhap ? '+' : '−'}{m.qty}</td>
                  <td className={cx(td, 'text-muted')}>{m.note}</td>
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
          <thead><tr><th className={th}>Sản phẩm</th><th className={th}>Tồn hệ thống</th><th className={th}>Thực tế</th><th className={th}>Chênh lệch</th><th className={th}>Tình trạng</th></tr></thead>
          <tbody>
            {dsSanPham.slice(0, 10).map((p, i) => (
              <tr key={p.id}>
                <td className={cx(td, 'min-w-64 font-medium')}>{p.name}</td>
                <td className={cx(td, 'tabular-nums')}>{tonKho[p.id] ?? 0}</td>
                <td className={td}>
                  <input
                    type="number"
                    min={0}
                    defaultValue={i === 2 ? (tonKho[p.id] ?? 0) - 1 : ''}
                    aria-label={`Số lượng thực tế của ${p.name}`}
                    className="h-9 w-24 rounded-md bg-surface px-2 focus:bg-white focus:outline-2 focus:outline-brand"
                  />
                </td>
                <td className={td}>{i === 2 ? <Nhan tone="red">−1</Nhan> : '—'}</td>
                <td className={td}><NhanTonKho n={tonKho[p.id] ?? 0} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function QuanLyKho() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Nhập kho')
  const [lichSuNhap, setLichSuNhap] = useState(lichSuMau)
  const [lichSuXuat, setLichSuXuat] = useState(lichSuMau)
  return (
    <>
      <TieuDeTrang title="Quản lý kho" desc="Nhập hàng, xuất hàng và kiểm kê tồn kho trên cùng một màn hình." />
      <div className="mb-6"><ThanhTab value={tab} onChange={setTab} items={tabs} /></div>
      {tab === 'Nhập kho' && <BieuMauNhapXuat type="Nhập" dong={lichSuNhap} onThem={(d) => setLichSuNhap((x) => [d, ...x])} />}
      {tab === 'Xuất kho' && <BieuMauNhapXuat type="Xuất" dong={lichSuXuat} onThem={(d) => setLichSuXuat((x) => [d, ...x])} />}
      {tab === 'Kiểm kê' && <KiemKe />}
    </>
  )
}
