import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Nut, TruongNhap } from '../../components/GiaoDienCoBan'
import { useAuthStore } from '../../auth/auth';
import { useThongBao } from '../../store/thongBao';
import api from '../../lib/api';
import axios from 'axios';

function KhungXacThuc({ title, desc, children, foot }: { title: string; desc?: string; children: ReactNode; foot?: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2">
      <div className="hidden flex-col justify-between rounded-xl bg-brand p-10 text-white md:flex">
        <p className="text-4xl leading-tight font-extrabold tracking-tight">Linh kiện chính hãng, tư vấn bởi trợ lý TechZone.</p>
        <p className="text-white/80">Theo dõi đơn hàng, lưu lịch sử mua sắm và nhận ưu đãi dành cho thành viên.</p>
      </div>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {desc && <p className="mt-2 text-muted">{desc}</p>}
        <div className="mt-8">{children}</div>
        {foot && <div className="mt-6 text-[15px] text-muted">{foot}</div>}
      </div>
    </div>
  )
}

export function DangNhap() {
  const chuyenTrang = useNavigate()
  const viTri = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const hienThongBao = useThongBao((s) => s.hien)

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await api.post('/auth/dang-nhap', { email, password })
      login({ accessToken: res.data.accessToken, user: res.data.taiKhoan })
      hienThongBao(`Chào mừng, ${res.data.taiKhoan.hoTen ?? res.data.taiKhoan.email}!`, 'Đăng nhập thành công.')
      const vaiTro = res.data.taiKhoan.vaiTro
      const trangTruoc = (viTri.state as { tu?: string } | null)?.tu
      chuyenTrang(trangTruoc ?? (vaiTro === 'admin' ? '/quan-tri' : vaiTro === 'nhan_vien' ? '/nhan-vien' : '/'))
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message
        setError(Array.isArray(msg) ? msg.join(',') : (msg ?? 'Đăng nhập thất bại'))
      }
      else setError('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KhungXacThuc
      title="Đăng nhập"
      desc="Dùng chung cho khách hàng và nhân viên."
      foot={
        <>
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="font-semibold text-brand">
            Đăng ký
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="text-sm font-semibold text-danger">{error}</p>}
        <TruongNhap type="email" label="Email" placeholder="abc@gmail.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <TruongNhap type="password" label="Mật khẩu" placeholder="*********" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
        <div className="text-right">
          <Link to="/quen-mat-khau" className="text-sm font-semibold text-brand">
            Quên mật khẩu?
          </Link>
        </div>
        <Nut size="lg" className="w-full" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Nut>
      </form>
    </KhungXacThuc>
  )
}

export function DangKy() {
  const chuyenTrang = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPass) {
      setError('Mật khẩu không trùng khớp')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/dang-ky', {
        hoTen: name,
        email,
        password,
        soDienThoai: phone
      })
      chuyenTrang('/dang-nhap')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message
        setError(Array.isArray(msg) ? msg.join(',') : (msg ?? 'Đăng ký thất bại'))
      }
      else setError('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KhungXacThuc
      title="Tạo tài khoản"
      foot={
        <>
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="font-semibold text-brand">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="text-sm font-semibold text-danger">{error}</p>}
        <TruongNhap label="Họ và tên" placeholder="Nguyễn Văn A" autoComplete="name" value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <TruongNhap label="Số điện thoại" placeholder="0812312312" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.currentTarget.value)} />
        <TruongNhap type="email" label="Email" placeholder="abc@gmail.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <TruongNhap type="password" label="Mật khẩu" placeholder="*********" autoComplete="new-password" hint="Tối thiểu 6 ký tự" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
        <TruongNhap type="password" label="Nhập lại mật khẩu" placeholder="*********" autoComplete="new-password" value={confirmPass} onChange={(e) => setConfirmPass(e.currentTarget.value)} />
        <Nut size="lg" className="w-full" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Nut>
      </form>
    </KhungXacThuc>
  )
}

export function QuenMatKhau() {
  const [daGui, setDaGui] = useState(false)
  return (
    <KhungXacThuc
      title="Quên mật khẩu"
      desc="Nhập email đã đăng ký. Chúng tôi gửi liên kết đặt lại mật khẩu cho bạn."
      foot={
        <Link to="/dang-nhap" className="font-semibold text-brand">
          ← Quay lại đăng nhập
        </Link>
      }
    >
      {daGui ? (
        <div className="rise rounded-lg bg-ok/10 p-5">
          <p className="font-bold">Đã gửi email hướng dẫn</p>
          <p className="mt-1 text-[15px]">Kiểm tra hộp thư của bạn. Liên kết có hiệu lực trong 30 phút.</p>
          <Link to="/dat-lai-mat-khau" className="mt-3 inline-block text-sm font-semibold text-brand">
            Mở trang đặt lại mật khẩu
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setDaGui(true)
          }}
          className="space-y-4"
        >
          <TruongNhap type="email" label="Email" />
          <Nut size="lg" className="w-full">
            Gửi liên kết đặt lại
          </Nut>
        </form>
      )}
    </KhungXacThuc>
  )
}

export function DatLaiMatKhau() {
  const chuyenTrang = useNavigate()
  return (
    <KhungXacThuc title="Đặt lại mật khẩu" desc="Chọn mật khẩu mới cho tài khoản của bạn.">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          chuyenTrang('/dang-nhap')
        }}
        className="space-y-4"
      >
        <TruongNhap type="password" label="Mật khẩu mới" autoComplete="new-password" />
        <TruongNhap type="password" label="Nhập lại mật khẩu mới" autoComplete="new-password" />
        <Nut size="lg" className="w-full">
          Cập nhật mật khẩu
        </Nut>
      </form>
    </KhungXacThuc>
  )
}
