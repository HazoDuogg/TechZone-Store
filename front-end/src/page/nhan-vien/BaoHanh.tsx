import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, HopThoai, OChon, NhanTrangThai, VungNhap } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsPhieuBaoHanh } from '../../data/duLieuMau'
import { ngayVN } from '../../lib/dinhDang'

type Ticket = (typeof dsPhieuBaoHanh)[number]
const statuses = ['Tiếp nhận', 'Đang kiểm tra', 'Đang sửa', 'Chờ linh kiện', 'Hoàn tất', 'Từ chối']

export default function BaoHanh() {
  const [looked, setLooked] = useState(false)
  const [edit, setEdit] = useState<Ticket | null>(null)
  const [create, setCreate] = useState(false)

  return (
    <>
      <TieuDeTrang title="Bảo hành" desc="Tiếp nhận yêu cầu, tra cứu theo serial và cập nhật kết quả sửa chữa." action={<Nut onClick={() => setCreate(true)}>Tiếp nhận yêu cầu</Nut>} />

      <section className="mb-8 rounded-xl bg-white p-5" aria-labelledby="sn">
        <h2 id="sn" className="mb-3 font-bold">Tra cứu bảo hành theo serial</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setLooked(true)
          }}
          className="flex flex-wrap items-end gap-3"
        >
          <TruongNhap label="Số serial" placeholder="Ví dụ: SN-RTX4060-77120" className="min-w-0 flex-1 sm:max-w-md" />
          <Nut variant="dark">Tra cứu</Nut>
        </form>
        {looked && (
          <div className="rise mt-4 rounded-lg bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">MSI GeForce RTX 4060 VENTUS 2X 8GB</span>
              <Nhan tone="green">Còn bảo hành</Nhan>
            </div>
            <p className="mt-1 text-[15px] text-muted">Khách: Trần Thu Hà · Mua ngày 19/10/2026 · Bảo hành đến 19/10/2029</p>
          </div>
        )}
      </section>

      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead><tr><th className={th}>Mã</th><th className={th}>Serial</th><th className={th}>Tình trạng báo</th><th className={th}>Ngày nhận</th><th className={th}>Trạng thái</th><th className={th}><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>
            {dsPhieuBaoHanh.map((t) => (
              <tr key={t.id}>
                <td className={cx(td, 'font-bold')}>{t.id}</td>
                <td className={td}>{t.serial}<div className="text-sm text-muted">{t.customer}</div></td>
                <td className={cx(td, 'max-w-72')}>{t.issue}{t.result && <div className="text-sm text-muted">Kết quả: {t.result}</div>}</td>
                <td className={cx(td, 'whitespace-nowrap')}>{ngayVN(t.createdAt)}</td>
                <td className={td}><NhanTrangThai status={t.status} /></td>
                <td className={td}><Nut size="sm" variant="soft" onClick={() => setEdit(t)}>Cập nhật</Nut></td>
              </tr>
            ))}
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

      {create && (
        <HopThoai title="Tiếp nhận yêu cầu bảo hành" onClose={() => setCreate(false)}>
          <form onSubmit={(e) => { e.preventDefault(); setCreate(false) }} className="space-y-4">
            <TruongNhap label="Số serial" />
            <TruongNhap label="Tên khách" />
            <VungNhap label="Tình trạng khách báo" />
            <div className="flex justify-end gap-2"><Nut type="button" variant="soft" onClick={() => setCreate(false)}>Hủy</Nut><Nut>Tiếp nhận</Nut></div>
          </form>
        </HopThoai>
      )}
    </>
  )
}
