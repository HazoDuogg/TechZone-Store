import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore, type NguoiDung } from '../auth/auth'
import { coQuyen } from '../lib/quyen'

export default function XetVaiTro({ vaiTroDuocPhep, chucNang }: { vaiTroDuocPhep: NguoiDung['vaiTro'][]; chucNang?: string }) {
  const user = useAuthStore((s) => s.user)
  const viTri = useLocation()

  if (!user) {
    return <Navigate to={'/dang-nhap'} replace state={{ tu: viTri.pathname }} />
  }
  if (!vaiTroDuocPhep.includes(user.vaiTro)) {
    return <Navigate to={'/'} replace />
  }
  if (chucNang && !coQuyen(user, chucNang)) {
    return <Navigate to={'/nhan-vien'} replace />
  }
  return <Outlet />
}
