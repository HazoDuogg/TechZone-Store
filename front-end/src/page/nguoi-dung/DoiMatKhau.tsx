import { useRef, useState } from 'react'
import { Nut, TruongNhap } from '../../components/GiaoDienCoBan'
import api from '../../lib/api'
import { useGuiForm } from '../../hooks/useGuiForm'

export default function DoiMatKhau() {
  const form = useRef<HTMLFormElement>(null)
  const [daDoi, setDaDoi] = useState(false)
  const { dangGui, loi, datLoi, gui } = useGuiForm()

  function doi(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const duLieu = new FormData(e.currentTarget)
    const matKhauMoi = String(duLieu.get('matKhauMoi'))
    setDaDoi(false)
    if (matKhauMoi !== String(duLieu.get('nhapLai'))) {
      datLoi('Mật khẩu nhập lại không khớp')
      return
    }
    gui(
      () => api.post('/tai-khoan/doi-mat-khau', { matKhauHienTai: String(duLieu.get('matKhauHienTai')), matKhauMoi }),
      () => {
        form.current?.reset()
        setDaDoi(true)
      },
    )
  }

  return (
    <form ref={form} onSubmit={doi} className="max-w-lg space-y-4 rounded-xl bg-surface p-6">
      {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
      {daDoi && (
        <p role="status" className="text-sm font-semibold text-ok">
          Đã đổi mật khẩu.
        </p>
      )}
      <TruongNhap name="matKhauHienTai" label="Mật khẩu hiện tại" type="password" required autoComplete="current-password" />
      <TruongNhap name="matKhauMoi" label="Mật khẩu mới" type="password" required minLength={6} autoComplete="new-password" hint="Từ 6 ký tự trở lên." />
      <TruongNhap name="nhapLai" label="Nhập lại mật khẩu mới" type="password" required autoComplete="new-password" />
      <Nut disabled={dangGui}>{dangGui ? 'Đang đổi...' : 'Đổi mật khẩu'}</Nut>
    </form>
  )
}
