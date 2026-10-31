import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, OChon, ThanhTab } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsSanPham, tonKho } from '../../data/duLieuMau'
import { NhanTonKho } from './SanPhamVaTonKho'

const tabs = ['Nhập kho', 'Xuất kho', 'Kiểm kê'] as const

const history = [
  { at: '25/10/2026 09:10', id: 'ram-d5-32', qty: 10, note: 'Phiếu nhập PN-0231' },
  { at: '24/10/2026 15:42', id: 'ssd-980pro', qty: 5, note: 'Phiếu nhập PN-0230' },
  { at: '22/10/2026 11:05', id: 'cpu-7600', qty: 8, note: 'Phiếu nhập PN-0229' },
]

function BieuMauNhapXuat({ type }: { type: 'Nhập' | 'Xuất' }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form onSubmit={(e) => e.preventDefault()} className="h-fit space-y-4 rounded-xl bg-white p-5">
        <OChon label="Sản phẩm">
          {dsSanPham.map((p) => <option key={p.id} value={p.id}>{p.name} (tồn {tonKho[p.id] ?? 0})</option>)}
        </OChon>
        <TruongNhap type="number" min={1} defaultValue={1} label="Số lượng" />
        <TruongNhap label="Ghi chú" placeholder={type === 'Nhập' ? 'Số phiếu nhập, nhà cung cấp' : 'Lý do xuất'} />
        <Nut className="w-full">{type} kho</Nut>
      </form>
      <div>
        <h2 className="mb-3 font-bold">Lịch sử {type.toLowerCase()} kho</h2>
        <div className={cx(tableWrap, 'bg-white')}>
          <table className="w-full">
            <thead><tr><th className={th}>Thời gian</th><th className={th}>Sản phẩm</th><th className={th}>SL</th><th className={th}>Ghi chú</th></tr></thead>
            <tbody>
              {history.map((m) => (
                <tr key={m.at}>
                  <td className={cx(td, 'whitespace-nowrap')}>{m.at}</td>
                  <td className={td}>{dsSanPham.find((p) => p.id === m.id)?.name}</td>
                  <td className={cx(td, 'font-bold tabular-nums')}>{type === 'Nhập' ? '+' : '−'}{m.qty}</td>
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
  return (
    <>
      <TieuDeTrang title="Quản lý kho" desc="Nhập hàng, xuất hàng và kiểm kê tồn kho trên cùng một màn hình." />
      <div className="mb-6"><ThanhTab value={tab} onChange={setTab} items={tabs} /></div>
      {tab === 'Nhập kho' && <BieuMauNhapXuat type="Nhập" />}
      {tab === 'Xuất kho' && <BieuMauNhapXuat type="Xuất" />}
      {tab === 'Kiểm kê' && <KiemKe />}
    </>
  )
}
