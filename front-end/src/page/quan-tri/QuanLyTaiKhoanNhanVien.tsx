import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, HopThoai, OChon, ThanhTab } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsNhanVien } from '../../data/duLieuMau'

type Staff = (typeof dsNhanVien)[number]
const roles = ['Bán hàng', 'Kỹ thuật', 'Kho']
const modules = ['Đơn hàng', 'Tồn kho', 'Khách hàng', 'Bảo hành', 'Nhập xuất kho']
const tabs = ['Nhân viên', 'Phân quyền'] as const

const defaults: Record<string, string[]> = {
  'Bán hàng': ['Đơn hàng', 'Tồn kho', 'Khách hàng'],
  'Kỹ thuật': ['Bảo hành', 'Tồn kho'],
  Kho: ['Tồn kho', 'Nhập xuất kho'],
  'Quản lý': modules,
}

function TabNhanVien() {
  const [edit, setEdit] = useState<Staff | 'new' | null>(null)
  const cur = edit && edit !== 'new' ? edit : undefined

  return (
    <>
      <div className="mb-4 flex justify-end"><Nut onClick={() => setEdit('new')}>Thêm nhân viên</Nut></div>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead><tr><th className={th}>Nhân viên</th><th className={th}>Vai trò</th><th className={th}>Trạng thái</th><th className={th}><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>
            {dsNhanVien.map((s) => (
              <tr key={s.id}>
                <td className={td}><div className="font-semibold">{s.name}</div><div className="text-sm text-muted">{s.email}</div></td>
                <td className={td}>{s.role}</td>
                <td className={td}>{s.locked ? <Nhan tone="red">Đã khóa</Nhan> : <Nhan tone="green">Hoạt động</Nhan>}</td>
                <td className={cx(td, 'whitespace-nowrap')}>
                  <Nut size="sm" variant="soft" onClick={() => setEdit(s)}>Sửa</Nut>{' '}
                  <Nut size="sm" variant={s.locked ? 'soft' : 'danger'}>{s.locked ? 'Mở khóa' : 'Khóa'}</Nut>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <HopThoai title={cur ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên'} onClose={() => setEdit(null)}>
          <form onSubmit={(e) => { e.preventDefault(); setEdit(null) }} className="space-y-4">
            <TruongNhap label="Họ và tên" defaultValue={cur?.name} />
            <TruongNhap type="email" label="Email đăng nhập" defaultValue={cur?.email} />
            <OChon label="Vai trò" defaultValue={cur?.role}>{roles.map((r) => <option key={r}>{r}</option>)}</OChon>
            <div className="flex justify-end gap-2 pt-2"><Nut type="button" variant="soft" onClick={() => setEdit(null)}>Hủy</Nut><Nut>Lưu</Nut></div>
          </form>
        </HopThoai>
      )}
    </>
  )
}

function TabPhanQuyen() {
  return (
    <>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead><tr><th className={th}>Chức năng</th>{roles.map((r) => <th key={r} className={cx(th, 'text-center')}>{r}</th>)}</tr></thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m}>
                <td className={cx(td, 'font-medium')}>{m}</td>
                {roles.map((r) => (
                  <td key={r} className={cx(td, 'text-center')}>
                    <input type="checkbox" defaultChecked={defaults[r].includes(m)} disabled={r === 'Quản lý'} aria-label={`${r} - ${m}`} className="size-5 accent-brand" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Nut>Lưu phân quyền</Nut>
      </div>
    </>
  )
}

export default function QuanLyTaiKhoanNhanVien() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Nhân viên')
  return (
    <>
      <TieuDeTrang title="Tài khoản nhân viên" desc="Thêm, sửa thông tin, khóa hoặc mở tài khoản và phân quyền theo vai trò." />
      <div className="mb-6"><ThanhTab value={tab} onChange={setTab} items={tabs} /></div>
      {tab === 'Nhân viên' ? <TabNhanVien /> : <TabPhanQuyen />}
    </>
  )
}
