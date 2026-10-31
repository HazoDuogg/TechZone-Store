import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BoCucQuanLy, BoCucCuaHang, type MucMenu } from './components/BoCuc'
import TrangChu from './page/nguoi-dung/TrangChu'
import DanhSachSanPham from './page/nguoi-dung/DanhSachSanPham'
import ChiTietSanPham from './page/nguoi-dung/ChiTietSanPham'
import GioHang from './page/nguoi-dung/GioHang'
import DatHang from './page/nguoi-dung/DatHang'
import DonHang from './page/nguoi-dung/DonHang'
import ChiTietDonHang from './page/nguoi-dung/ChiTietDonHang'
import BuildPC from './page/nguoi-dung/BuildPC'
import { QuenMatKhau, DangNhap, DangKy, DatLaiMatKhau } from './page/nguoi-dung/TaiKhoan'
import DonHangCanXuLy from './page/nhan-vien/DonHangCanXuLy'
import ChiTietDonHangNhanVien from './page/nhan-vien/ChiTietDonHangNhanVien'
import SanPhamVaTonKho from './page/nhan-vien/SanPhamVaTonKho'
import KhachHang from './page/nhan-vien/KhachHang'
import BaoHanh from './page/nhan-vien/BaoHanh'
import QuanLyKho from './page/nhan-vien/QuanLyKho'
import BaoCaoThongKe from './page/quan-tri/BaoCaoThongKe'
import QuanLySanPham from './page/quan-tri/QuanLySanPham'
import QuanLyMaGiamGia from './page/quan-tri/QuanLyMaGiamGia'
import QuanLyTaiKhoanNhanVien from './page/quan-tri/QuanLyTaiKhoanNhanVien'

const staffNav: MucMenu[] = [
  { to: '/nhan-vien/don-hang', label: 'Đơn hàng', group: 'Bán hàng' },
  { to: '/nhan-vien/ton-kho', label: 'Sản phẩm và tồn kho', group: 'Bán hàng' },
  { to: '/nhan-vien/khach-hang', label: 'Khách hàng', group: 'Bán hàng' },
  { to: '/nhan-vien/bao-hanh', label: 'Bảo hành', group: 'Kỹ thuật' },
  { to: '/nhan-vien/kho', label: 'Nhập, xuất, kiểm kê', group: 'Kho' },
]

const adminNav: MucMenu[] = [
  { to: '/quan-tri/bao-cao', label: 'Báo cáo thống kê', group: 'Tổng quan' },
  { to: '/quan-tri/san-pham', label: 'Sản phẩm và danh mục', group: 'Cửa hàng' },
  { to: '/quan-tri/ma-giam-gia', label: 'Mã giảm giá', group: 'Cửa hàng' },
  { to: '/quan-tri/tai-khoan', label: 'Tài khoản nhân viên', group: 'Hệ thống' },
  { to: '/quan-tri/don-hang', label: 'Đơn hàng', group: 'Vận hành' },
  { to: '/quan-tri/kho', label: 'Kho', group: 'Vận hành' },
]

function CuonLenDau() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <CuonLenDau />
      <Routes>
        <Route element={<BoCucCuaHang />}>
          <Route path="/" element={<TrangChu />} />
          <Route path="san-pham" element={<DanhSachSanPham />} />
          <Route path="san-pham/:id" element={<ChiTietSanPham />} />
          <Route path="gio-hang" element={<GioHang />} />
          <Route path="thanh-toan" element={<DatHang />} />
          <Route path="don-hang" element={<DonHang />} />
          <Route path="don-hang/:code" element={<ChiTietDonHang />} />
          <Route path="build-pc" element={<BuildPC />} />
          <Route path="dang-nhap" element={<DangNhap />} />
          <Route path="dang-ky" element={<DangKy />} />
          <Route path="quen-mat-khau" element={<QuenMatKhau />} />
          <Route path="dat-lai-mat-khau" element={<DatLaiMatKhau />} />
        </Route>

        <Route path="nhan-vien" element={<BoCucQuanLy title="Nhân viên" items={staffNav} />}>
          <Route index element={<Navigate to="don-hang" replace />} />
          <Route path="don-hang" element={<DonHangCanXuLy />} />
          <Route path="don-hang/:code" element={<ChiTietDonHangNhanVien />} />
          <Route path="ton-kho" element={<SanPhamVaTonKho />} />
          <Route path="khach-hang" element={<KhachHang />} />
          <Route path="bao-hanh" element={<BaoHanh />} />
          <Route path="kho" element={<QuanLyKho />} />
        </Route>

        <Route path="quan-tri" element={<BoCucQuanLy title="Quản trị" items={adminNav} />}>
          <Route index element={<Navigate to="bao-cao" replace />} />
          <Route path="bao-cao" element={<BaoCaoThongKe />} />
          <Route path="san-pham" element={<QuanLySanPham />} />
          <Route path="ma-giam-gia" element={<QuanLyMaGiamGia />} />
          <Route path="tai-khoan" element={<QuanLyTaiKhoanNhanVien />} />
          <Route path="don-hang" element={<DonHangCanXuLy />} />
          <Route path="don-hang/:code" element={<ChiTietDonHangNhanVien />} />
          <Route path="kho" element={<QuanLyKho />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
