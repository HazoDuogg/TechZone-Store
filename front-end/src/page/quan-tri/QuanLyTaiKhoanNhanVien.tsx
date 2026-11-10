import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, HopThoai, OChon, ThanhTab } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsNhanVien } from '../../data/duLieuMau'
import { CAC_CHUC_NANG, CAC_VI_TRI, QUYEN_MAC_DINH } from '../../constants'
import type { ThongTinNhanVien } from '../../types'

const CAC_TAB = ['Nhân viên', 'Phân quyền'] as const

function TabNhanVien() {
  const [dangSua, setDangSua] = useState<ThongTinNhanVien | 'moi' | null>(null)
  const nhanVienDangSua = dangSua && dangSua !== 'moi' ? dangSua : undefined

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Nut onClick={() => setDangSua('moi')}>Thêm nhân viên</Nut>
      </div>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Nhân viên</th>
              <th className={th}>Vai trò</th>
              <th className={th}>Trạng thái</th>
              <th className={th}>
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {dsNhanVien.map((nv) => (
              <tr key={nv.id}>
                <td className={td}>
                  <div className="font-semibold">{nv.name}</div>
                  <div className="text-sm text-muted">{nv.email}</div>
                </td>
                <td className={td}>{nv.role}</td>
                <td className={td}>{nv.locked ? <Nhan tone="red">Đã khóa</Nhan> : <Nhan tone="green">Hoạt động</Nhan>}</td>
                <td className={cx(td, 'whitespace-nowrap')}>
                  <Nut size="sm" variant="soft" onClick={() => setDangSua(nv)}>
                    Sửa
                  </Nut>{' '}
                  <Nut size="sm" variant={nv.locked ? 'soft' : 'danger'}>
                    {nv.locked ? 'Mở khóa' : 'Khóa'}
                  </Nut>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dangSua && (
        <HopThoai title={nhanVienDangSua ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên'} onClose={() => setDangSua(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDangSua(null)
            }}
            className="space-y-4"
          >
            <TruongNhap label="Họ và tên" defaultValue={nhanVienDangSua?.name} />
            <TruongNhap type="email" label="Email đăng nhập" defaultValue={nhanVienDangSua?.email} />
            {!nhanVienDangSua && <TruongNhap type="password" label="Mật khẩu" />}
            <OChon label="Vị trí" defaultValue={nhanVienDangSua?.role}>
              {CAC_VI_TRI.map((viTri) => (
                <option key={viTri}>{viTri}</option>
              ))}
            </OChon>
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setDangSua(null)}>
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

function TabPhanQuyen() {
  return (
    <>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Chức năng</th>
              {CAC_VI_TRI.map((viTri) => (
                <th key={viTri} className={cx(th, 'text-center')}>
                  {viTri}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAC_CHUC_NANG.map((chucNang) => (
              <tr key={chucNang}>
                <td className={cx(td, 'font-medium')}>{chucNang}</td>
                {CAC_VI_TRI.map((viTri) => (
                  <td key={viTri} className={cx(td, 'text-center')}>
                    <input type="checkbox" defaultChecked={QUYEN_MAC_DINH[viTri].includes(chucNang)} aria-label={`${viTri} - ${chucNang}`} className="size-5 accent-brand" />
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
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>('Nhân viên')
  return (
    <>
      <TieuDeTrang title="Tài khoản nhân viên" desc="Thêm, sửa thông tin, khóa hoặc mở tài khoản và phân quyền theo vai trò." />
      <div className="mb-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>
      {tab === 'Nhân viên' ? <TabNhanVien /> : <TabPhanQuyen />}
    </>
  )
}
