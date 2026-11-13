import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore, type NguoiDung } from "../auth/auth";

export default function XetVaiTro({ vaiTroDuocPhep }: { vaiTroDuocPhep: NguoiDung['vaiTro'][] }) {
    const user = useAuthStore((s) => s.user)
    const viTri = useLocation()

    if (!user) {
        return <Navigate to={'/dang-nhap'} replace state={{ tu: viTri.pathname }} />
    }
    if (!vaiTroDuocPhep.includes(user.vaiTro)) {
        return <Navigate to={'/'} replace />
    }
    return <Outlet />
}