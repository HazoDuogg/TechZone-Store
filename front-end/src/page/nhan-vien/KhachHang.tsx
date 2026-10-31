import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nut, TruongNhap, HopThoai, VungNhap } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsKhachHang } from '../../data/duLieuMau'

type Customer = (typeof dsKhachHang)[number]

export default function KhachHang() {
  const [edit, setEdit] = useState<Customer | null>(null)

  return (
    <>
      <TieuDeTrang
        title="Thông tin khách hàng"
        desc="Lưu liên hệ và ghi chú chăm sóc khách."
        action={<Nut onClick={() => setEdit({ id: 0, name: '', phone: '', email: '', address: '', note: '' })}>Thêm khách hàng</Nut>}
      />
      <input
        placeholder="Tìm theo tên, số điện thoại, email"
        aria-label="Tìm khách hàng"
        className="mb-4 h-11 w-full rounded-md bg-white px-3 text-[15px] focus:outline-2 focus:outline-brand sm:max-w-md"
      />
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr><th className={th}>Khách hàng</th><th className={th}>Liên hệ</th><th className={th}>Ghi chú</th><th className={th}><span className="sr-only">Thao tác</span></th></tr>
          </thead>
          <tbody>
            {dsKhachHang.map((c) => (
              <tr key={c.id}>
                <td className={td}><div className="font-semibold">{c.name}</div><div className="max-w-64 text-sm text-muted">{c.address}</div></td>
                <td className={td}>{c.phone}<div className="text-sm text-muted">{c.email}</div></td>
                <td className={cx(td, 'max-w-56 text-muted')}>{c.note || '—'}</td>
                <td className={td}><Nut size="sm" variant="soft" onClick={() => setEdit(c)}>Sửa</Nut></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <HopThoai title={edit.id ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng'} onClose={() => setEdit(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setEdit(null)
            }}
            className="space-y-4"
          >
            <TruongNhap label="Họ và tên" defaultValue={edit.name} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TruongNhap label="Số điện thoại" defaultValue={edit.phone} />
              <TruongNhap type="email" label="Email" defaultValue={edit.email} />
            </div>
            <TruongNhap label="Địa chỉ" defaultValue={edit.address} />
            <VungNhap label="Ghi chú" defaultValue={edit.note} />
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setEdit(null)}>Hủy</Nut>
              <Nut>Lưu</Nut>
            </div>
          </form>
        </HopThoai>
      )}
    </>
  )
}
