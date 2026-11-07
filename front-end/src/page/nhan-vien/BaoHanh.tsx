import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, HopThoai, OChon, NhanTrangThai, VungNhap, ThanhTab } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsDonHang, dsPhieuBaoHanh } from '../../data/duLieuMau'
import { ngayVN, timSanPham } from '../../lib/dinhDang'

type Ticket = (typeof dsPhieuBaoHanh)[number]
const statuses = ['Tiếp nhận', 'Đang kiểm tra', 'Đang sửa', 'Chờ linh kiện', 'Hoàn tất', 'Từ chối'] as const
const boLoc = ['Tất cả', ...statuses] as const
const cachTraCuu = ['Theo serial', 'Theo mã đơn hàng'] as const
const donMau = dsDonHang[1]

export default function BaoHanh() {
  const [looked, setLooked] = useState(false)
  const [mode, setMode] = useState<(typeof cachTraCuu)[number]>('Theo serial')
  const [edit, setEdit] = useState<Ticket | null>(null)
  const [loc, setLoc] = useState<(typeof boLoc)[number]>('Tất cả')
  const [loi, setLoi] = useState('')
  const [moi, setMoi] = useState<Ticket[]>([])

  const tiepNhan = (serial: string, customer: string, issue: string) => {
    setMoi((d) => [
      { id: `BH${String(13 + d.length).padStart(4, '0')}`, serial, customer, issue, status: 'Tiếp nhận', result: '', createdAt: new Date().toISOString().slice(0, 10) },
      ...d,
    ])
    setLoi('')
    setLoc('Tất cả')
  }

  const danhSach = [...moi, ...dsPhieuBaoHanh].filter((t) => loc === 'Tất cả' || t.status === loc)

  return (
    <>
      <TieuDeTrang title="Bảo hành" desc="Tra cứu theo serial hoặc mã đơn hàng, tiếp nhận ngay từ kết quả tra cứu và cập nhật kết quả sửa chữa." />

      <section className="mb-8 rounded-xl bg-white p-5" aria-labelledby="sn">
        <h2 id="sn" className="mb-3 font-bold">Tra cứu bảo hành</h2>
        <div className="mb-4">
          <ThanhTab value={mode} onChange={(v) => { setMode(v); setLooked(false) }} items={cachTraCuu} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setLooked(true)
          }}
          className="flex flex-wrap items-end gap-3"
        >
          {mode === 'Theo serial' ? (
            <TruongNhap label="Số serial" placeholder="Ví dụ: SN-RTX4060-77120" className="min-w-0 flex-1 sm:max-w-md" />
          ) : (
            <TruongNhap label="Mã đơn hàng" placeholder="Ví dụ: TZ240002" className="min-w-0 flex-1 sm:max-w-md" />
          )}
          <Nut variant="dark">Tra cứu</Nut>
        </form>
        {looked && (
          <div className="rise mt-4 rounded-lg bg-surface p-4">
            {mode === 'Theo serial' ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">MSI GeForce RTX 4060 VENTUS 2X 8GB</span>
                    <Nhan tone="green">Còn bảo hành</Nhan>
                  </span>
                  <Nut size="sm" disabled={!loi.trim()} onClick={() => tiepNhan('SN-RTX4060-77120', 'Trần Thu Hà', loi.trim())}>Tiếp nhận</Nut>
                </div>
                <p className="mt-1 text-[15px] text-muted">Khách: Trần Thu Hà · Mua ngày 19/10/2026 · Bảo hành đến 19/10/2029</p>
              </>
            ) : (
              <p className="text-[15px] text-muted">Đơn {donMau.code} · Khách: {donMau.customer} · {donMau.phone}</p>
            )}
            <VungNhap
              label="Tình trạng khách báo"
              value={loi}
              onChange={(e) => setLoi(e.target.value)}
              placeholder="Nhập mô tả lỗi rồi bấm Tiếp nhận"
              className="mt-3"
            />
            {mode === 'Theo mã đơn hàng' && (
              <ul className="mt-3 divide-y divide-surface-2">
                {donMau.items.map((i) => {
                  const ten = timSanPham(i.id)?.name ?? i.id
                  return (
                    <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <span className="min-w-0">
                        <span className="font-bold">{ten}</span>
                        <span className="text-muted"> × {i.qty}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Nhan tone="green">Còn bảo hành</Nhan>
                        <Nut size="sm" disabled={!loi.trim()} onClick={() => tiepNhan(`Đơn ${donMau.code}`, donMau.customer, `${ten}: ${loi.trim()}`)}>Tiếp nhận</Nut>
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </section>

      <div className="mb-4">
        <ThanhTab value={loc} onChange={setLoc} items={boLoc} />
      </div>

      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead><tr><th className={th}>Mã</th><th className={th}>Serial / Đơn</th><th className={th}>Tình trạng báo</th><th className={th}>Ngày nhận</th><th className={th}>Trạng thái</th><th className={th}><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>
            {danhSach.map((t) => (
              <tr key={t.id}>
                <td className={cx(td, 'font-bold')}>{t.id}</td>
                <td className={td}>{t.serial}<div className="text-sm text-muted">{t.customer}</div></td>
                <td className={cx(td, 'max-w-72')}>{t.issue}{t.result && <div className="text-sm text-muted">Kết quả: {t.result}</div>}</td>
                <td className={cx(td, 'whitespace-nowrap')}>{ngayVN(t.createdAt)}</td>
                <td className={td}><NhanTrangThai status={t.status} /></td>
                <td className={td}><Nut size="sm" variant="soft" onClick={() => setEdit(t)}>Cập nhật</Nut></td>
              </tr>
            ))}
            {danhSach.length === 0 && (
              <tr><td className={cx(td, 'text-center text-muted')} colSpan={6}>Không có phiếu bảo hành nào ở trạng thái "{loc}".</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {edit && (
        <HopThoai title={`Cập nhật ${edit.id}`} onClose={() => setEdit(null)}>
          <form onSubmit={(e) => { e.preventDefault(); setEdit(null) }} className="space-y-4">
            <p className="text-[15px] text-muted">{edit.issue}</p>
            <OChon label="Trạng thái" defaultValue={edit.status}>{statuses.map((s) => <option key={s}>{s}</option>)}</OChon>
            <VungNhap label="Kết quả sửa chữa / ghi chú" defaultValue={edit.result} />
            <div className="flex justify-end gap-2"><Nut type="button" variant="soft" onClick={() => setEdit(null)}>Hủy</Nut><Nut>Lưu</Nut></div>
          </form>
        </HopThoai>
      )}
    </>
  )
}
