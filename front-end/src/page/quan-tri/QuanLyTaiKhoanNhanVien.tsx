import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, HopThoai, OChon, ThanhTab, TrangTrong } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import api from '../../lib/api'
import { layThongBaoLoi } from '../../lib/thongBaoLoi'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useThongBao } from '../../store/thongBao'
import { CAC_CHUC_NANG, CAC_VI_TRI, NHAN_VI_TRI, QUYEN_MAC_DINH } from '../../constants'
import type { NhanVien } from '../../types'

const CAC_TAB = ['Nhân viên', 'Phân quyền'] as const

function TabNhanVien() {
  const { duLieu: dsNhanVien = [], dangTai, loi: loiTai, taiLai } = useTaiDuLieu<NhanVien[]>('/nhan-vien')
  const [dangSua, setDangSua] = useState<NhanVien | 'moi' | null>(null)
  const [dangDatLai, setDangDatLai] = useState<NhanVien | null>(null)
  const [loiForm, setLoiForm] = useState<string | null>(null)
  const [dangLuu, setDangLuu] = useState(false)
  const hienThongBao = useThongBao((s) => s.hien)
  const nhanVienDangSua = dangSua && dangSua !== 'moi' ? dangSua : undefined

  const moSua = (nhanVien: NhanVien | 'moi') => {
    setLoiForm(null)
    setDangSua(nhanVien)
  }

  const moDatLai = (nhanVien: NhanVien) => {
    setLoiForm(null)
    setDangDatLai(nhanVien)
  }

  async function guiForm(yeuCau: () => Promise<unknown>, khiXong: () => void) {
    setDangLuu(true)
    setLoiForm(null)
    try {
      await yeuCau()
      khiXong()
      taiLai()
    } catch (err) {
      setLoiForm(layThongBaoLoi(err))
    } finally {
      setDangLuu(false)
    }
  }

  function luu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const thongTin = {
      hoTen: String(form.get('hoTen')),
      email: String(form.get('email')),
      soDienThoai: String(form.get('soDienThoai')),
      viTri: String(form.get('viTri')),
    }
    guiForm(
      () => (nhanVienDangSua ? api.patch(`/nhan-vien/${nhanVienDangSua.id}`, thongTin) : api.post('/nhan-vien', { ...thongTin, password: String(form.get('password')) })),
      () => setDangSua(null),
    )
  }

  function datLaiMatKhau(e: React.SubmitEvent<HTMLFormElement>, nhanVien: NhanVien) {
    e.preventDefault()
    const password = String(new FormData(e.currentTarget).get('password'))
    guiForm(
      () => api.post(`/nhan-vien/${nhanVien.id}/dat-lai-mat-khau`, { password }),
      () => {
        setDangDatLai(null)
        hienThongBao('Đã đặt lại mật khẩu', `Tài khoản ${nhanVien.email} dùng được mật khẩu mới ngay.`)
      },
    )
  }

  async function doiTrangThai(nhanVien: NhanVien) {
    const choNghiViec = nhanVien.trangThai === 'hoat_dong'
    if (choNghiViec && !window.confirm(`Cho ${nhanVien.hoTen} nghỉ việc? Họ sẽ không đăng nhập được nữa.`)) return
    try {
      await api.patch(`/nhan-vien/${nhanVien.id}`, { trangThai: choNghiViec ? 'nghi_viec' : 'hoat_dong' })
      taiLai()
    } catch (err) {
      hienThongBao('Không đổi được trạng thái', layThongBaoLoi(err))
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Nut onClick={() => moSua('moi')}>Thêm nhân viên</Nut>
      </div>

      {dangTai ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : dsNhanVien.length === 0 ? (
        <TrangTrong>Chưa có nhân viên nào.</TrangTrong>
      ) : (
        <div className={cx(tableWrap, 'bg-white')}>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Nhân viên</th>
                <th className={th}>Vị trí</th>
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
                    <div className="font-semibold">{nv.hoTen}</div>
                    <div className="text-sm text-muted">{nv.email}</div>
                    <div className="text-sm text-muted">{nv.soDienThoai}</div>
                  </td>
                  <td className={td}>{NHAN_VI_TRI[nv.viTri]}</td>
                  <td className={td}>{nv.trangThai === 'hoat_dong' ? <Nhan tone="green">Hoạt động</Nhan> : <Nhan tone="red">Đã nghỉ việc</Nhan>}</td>
                  <td className={cx(td, 'whitespace-nowrap')}>
                    <Nut size="sm" variant="soft" onClick={() => moSua(nv)}>
                      Sửa
                    </Nut>{' '}
                    <Nut size="sm" variant="soft" onClick={() => moDatLai(nv)}>
                      Đặt lại mật khẩu
                    </Nut>{' '}
                    <Nut size="sm" variant={nv.trangThai === 'hoat_dong' ? 'danger' : 'soft'} onClick={() => doiTrangThai(nv)}>
                      {nv.trangThai === 'hoat_dong' ? 'Cho nghỉ việc' : 'Cho làm lại'}
                    </Nut>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dangSua && (
        <HopThoai title={nhanVienDangSua ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên'} onClose={() => setDangSua(null)}>
          <form onSubmit={luu} className="space-y-4">
            {loiForm && <p className="text-sm font-semibold text-danger">{loiForm}</p>}
            <TruongNhap name="hoTen" label="Họ và tên" required defaultValue={nhanVienDangSua?.hoTen} />
            <TruongNhap name="email" type="email" label="Email đăng nhập" required defaultValue={nhanVienDangSua?.email} />
            {!nhanVienDangSua && <TruongNhap name="password" type="password" label="Mật khẩu" required minLength={6} autoComplete="new-password" hint="Tối thiểu 6 ký tự" />}
            <TruongNhap name="soDienThoai" type="tel" label="Số điện thoại" required defaultValue={nhanVienDangSua?.soDienThoai} />
            <OChon name="viTri" label="Vị trí" defaultValue={nhanVienDangSua?.viTri ?? 'ban_hang'}>
              {CAC_VI_TRI.map((viTri) => (
                <option key={viTri} value={viTri}>
                  {NHAN_VI_TRI[viTri]}
                </option>
              ))}
            </OChon>
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setDangSua(null)}>
                Hủy
              </Nut>
              <Nut disabled={dangLuu}>{dangLuu ? 'Đang lưu...' : 'Lưu'}</Nut>
            </div>
          </form>
        </HopThoai>
      )}

      {dangDatLai && (
        <HopThoai title={`Đặt lại mật khẩu cho ${dangDatLai.hoTen}`} onClose={() => setDangDatLai(null)}>
          <form onSubmit={(e) => datLaiMatKhau(e, dangDatLai)} className="space-y-4">
            {loiForm && <p className="text-sm font-semibold text-danger">{loiForm}</p>}
            <TruongNhap name="password" type="password" label="Mật khẩu mới" required minLength={6} autoComplete="new-password" hint="Tối thiểu 6 ký tự. Hãy báo mật khẩu này cho nhân viên." />
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setDangDatLai(null)}>
                Hủy
              </Nut>
              <Nut disabled={dangLuu}>{dangLuu ? 'Đang lưu...' : 'Cập nhật mật khẩu'}</Nut>
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
      <p className="mb-4 text-sm text-muted">Quyền truy cập được cố định theo vị trí làm việc. Muốn nhân viên làm việc khác thì đổi vị trí của họ ở tab Nhân viên.</p>
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Chức năng</th>
              {CAC_VI_TRI.map((viTri) => (
                <th key={viTri} className={cx(th, 'text-center')}>
                  {NHAN_VI_TRI[viTri]}
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
                    <input type="checkbox" checked={QUYEN_MAC_DINH[viTri].includes(chucNang)} disabled readOnly aria-label={`${NHAN_VI_TRI[viTri]} - ${chucNang}`} className="size-5 accent-brand" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default function QuanLyTaiKhoanNhanVien() {
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>('Nhân viên')
  return (
    <>
      <TieuDeTrang title="Tài khoản nhân viên" desc="Thêm, sửa thông tin, đặt lại mật khẩu, cho nghỉ việc hoặc làm lại." />
      <div className="mb-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>
      {tab === 'Nhân viên' ? <TabNhanVien /> : <TabPhanQuyen />}
    </>
  )
}
