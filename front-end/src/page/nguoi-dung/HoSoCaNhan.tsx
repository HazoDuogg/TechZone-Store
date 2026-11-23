import { useState } from 'react'
import { Nut, TrangTrong, TruongNhap } from '../../components/GiaoDienCoBan'
import api from '../../lib/api'
import { ngayGioVN } from '../../lib/dinhDang'
import { useAuthStore } from '../../auth/auth'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import type { HoSoKhachHang } from '../../types'

export default function HoSoCaNhan() {
  const capNhatNguoiDung = useAuthStore((s) => s.capNhatNguoiDung)
  const { duLieu: hoSo, loi: loiTai, taiLai } = useTaiDuLieu<HoSoKhachHang>('/khach-hang/toi')
  const [daLuu, setDaLuu] = useState(false)
  const { dangGui, loi, gui } = useGuiForm()

  if (loiTai) return <p className="font-semibold text-danger">{loiTai}</p>
  if (!hoSo) return <TrangTrong>Đang tải...</TrangTrong>

  function luu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setDaLuu(false)
    gui(
      () =>
        api.patch<HoSoKhachHang>('/khach-hang/toi', { hoTen: String(form.get('hoTen')), soDienThoai: String(form.get('soDienThoai')).trim() }).then((res) => {
          capNhatNguoiDung({ hoTen: res.data.hoTen, soDienThoai: res.data.soDienThoai })
        }),
      () => {
        setDaLuu(true)
        taiLai()
      },
    )
  }

  return (
    <form onSubmit={luu} className="max-w-lg space-y-4 rounded-xl bg-surface p-6">
      {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
      {daLuu && (
        <p role="status" className="text-sm font-semibold text-ok">
          Đã lưu thông tin.
        </p>
      )}
      <TruongNhap label="Email" value={hoSo.email} disabled hint="Email dùng để đăng nhập nên không đổi được." readOnly />
      <TruongNhap name="hoTen" label="Họ và tên" defaultValue={hoSo.hoTen} required autoComplete="name" />
      <TruongNhap name="soDienThoai" label="Số điện thoại" defaultValue={hoSo.soDienThoai} required inputMode="tel" autoComplete="tel" />
      <p className="text-sm text-muted">Thành viên từ {ngayGioVN(hoSo.ngayTao)}</p>
      <Nut disabled={dangGui}>{dangGui ? 'Đang lưu...' : 'Lưu thay đổi'}</Nut>
    </form>
  )
}
