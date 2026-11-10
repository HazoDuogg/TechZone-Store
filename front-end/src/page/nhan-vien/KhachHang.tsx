import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nut, TruongNhap, HopThoai, VungNhap } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsKhachHang } from '../../data/duLieuMau'
import type { ThongTinKhachHang } from '../../types'

export default function KhachHang() {
  const [khachHangDangSua, setKhachHangDangSua] = useState<ThongTinKhachHang | null>(null)

  return (
    <>
      <TieuDeTrang
        title="Thông tin khách hàng"
        desc="Lưu liên hệ và ghi chú chăm sóc khách."
        action={<Nut onClick={() => setKhachHangDangSua({ id: 0, name: '', phone: '', email: '', address: '', note: '' })}>Thêm khách hàng</Nut>}
      />
      <input
        placeholder="Tìm theo tên, số điện thoại, email"
        aria-label="Tìm khách hàng"
        className="mb-4 h-11 w-full rounded-md bg-white px-3 text-[15px] focus:outline-2 focus:outline-brand sm:max-w-md"
      />
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Khách hàng</th>
              <th className={th}>Liên hệ</th>
              <th className={th}>Ghi chú</th>
              <th className={th}>
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {dsKhachHang.map((kh) => (
              <tr key={kh.id}>
                <td className={td}>
                  <div className="font-semibold">{kh.name}</div>
                  <div className="max-w-64 text-sm text-muted">{kh.address}</div>
                </td>
                <td className={td}>
                  {kh.phone}
                  <div className="text-sm text-muted">{kh.email}</div>
                </td>
                <td className={cx(td, 'max-w-56 text-muted')}>{kh.note || '—'}</td>
                <td className={td}>
                  <Nut size="sm" variant="soft" onClick={() => setKhachHangDangSua(kh)}>
                    Sửa
                  </Nut>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {khachHangDangSua && (
        <HopThoai title={khachHangDangSua.id ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng'} onClose={() => setKhachHangDangSua(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setKhachHangDangSua(null)
            }}
            className="space-y-4"
          >
            <TruongNhap label="Họ và tên" defaultValue={khachHangDangSua.name} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TruongNhap label="Số điện thoại" defaultValue={khachHangDangSua.phone} />
              <TruongNhap type="email" label="Email" defaultValue={khachHangDangSua.email} />
            </div>
            <TruongNhap label="Địa chỉ" defaultValue={khachHangDangSua.address} />
            <VungNhap label="Ghi chú" defaultValue={khachHangDangSua.note} />
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setKhachHangDangSua(null)}>
                Hủy
              </Nut>
              <Nut>Lưu</Nut>
            </div>
          </form>
        </HopThoai>
      )}
    </>
  )
}
