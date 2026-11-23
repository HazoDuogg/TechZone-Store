import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Nut, TruongNhap } from '../../components/GiaoDienCoBan'
import { useAuthStore } from '../../auth/auth'
import { useThongBao } from '../../store/thongBao'
import api from '../../lib/api'
import { layThongBaoLoi } from '../../lib/thongBaoLoi'

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
      chuyenTrang(vaiTro === 'admin' ? '/quan-tri' : vaiTro === 'nhan_vien' ? '/nhan-vien' : (trangTruoc ?? '/'))
    } catch (err) {
      setError(layThongBaoLoi(err, 'Đăng nhập thất bại'))
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
        <TruongNhap
          type="password"
          label="Mật khẩu"
          placeholder="*********"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
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
        soDienThoai: phone,
      })
      chuyenTrang('/dang-nhap')
    } catch (err) {
      setError(layThongBaoLoi(err, 'Đăng ký thất bại'))
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
        <TruongNhap
          type="password"
          label="Mật khẩu"
          placeholder="*********"
          autoComplete="new-password"
          hint="Tối thiểu 6 ký tự"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <TruongNhap
          type="password"
          label="Nhập lại mật khẩu"
          placeholder="*********"
          autoComplete="new-password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.currentTarget.value)}
        />
        <Nut size="lg" className="w-full" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Nut>
      </form>
    </KhungXacThuc>
  )
}

export function QuenMatKhau() {
  const chuyenTrang = useNavigate()
  const [email, setEmail] = useState('')
  const [loi, setLoi] = useState<string | null>(null)
  const [dangGui, setDangGui] = useState(false)

  async function guiMa(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoi(null)
    setDangGui(true)
    try {
      await api.post('/auth/quen-mat-khau', { email })
      chuyenTrang('/dat-lai-mat-khau', { state: { email } })
    } catch (err) {
      setLoi(layThongBaoLoi(err, 'Không gửi được mã'))
    } finally {
      setDangGui(false)
    }
  }

  return (
    <KhungXacThuc
      title="Quên mật khẩu"
      desc="Nhập email đã đăng ký. Chúng tôi sẽ gửi mã gồm 6 số để bạn đặt lại mật khẩu. Tài khoản nhân viên vui lòng liên hệ quản trị viên."
      foot={
        <Link to="/dang-nhap" className="font-semibold text-brand">
          ← Quay lại đăng nhập
        </Link>
      }
    >
      <form onSubmit={guiMa} className="space-y-4">
        {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
        <TruongNhap type="email" label="Email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <Nut size="lg" className="w-full" disabled={dangGui}>
          {dangGui ? 'Đang gửi...' : 'Gửi mã đặt lại'}
        </Nut>
      </form>
    </KhungXacThuc>
  )
}

export function DatLaiMatKhau() {
  const chuyenTrang = useNavigate()
  const viTri = useLocation()
  const hienThongBao = useThongBao((s) => s.hien)
  const emailDaNhap = (viTri.state as { email?: string } | null)?.email ?? ''
  const [loi, setLoi] = useState<string | null>(null)
  const [dangGui, setDangGui] = useState(false)

  async function datLai(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const matKhauMoi = String(form.get('matKhauMoi'))
    if (matKhauMoi !== String(form.get('nhapLai'))) {
      setLoi('Mật khẩu không trùng khớp')
      return
    }

    setLoi(null)
    setDangGui(true)
    try {
      await api.post('/auth/dat-lai-mat-khau', { email: String(form.get('email')), ma: String(form.get('ma')), matKhauMoi })
      hienThongBao('Đã đặt lại mật khẩu', 'Hãy đăng nhập bằng mật khẩu mới.')
      chuyenTrang('/dang-nhap')
    } catch (err) {
      setLoi(layThongBaoLoi(err, 'Không đặt lại được mật khẩu'))
    } finally {
      setDangGui(false)
    }
  }

  return (
    <KhungXacThuc
      title="Đặt lại mật khẩu"
      desc="Nhập mã gồm 6 số đã gửi tới email của bạn (có hiệu lực 10 phút) và chọn mật khẩu mới."
      foot={
        <>
          Chưa nhận được mã?{' '}
          <Link to="/quen-mat-khau" className="font-semibold text-brand">
            Gửi lại
          </Link>
        </>
      }
    >
      <form onSubmit={datLai} className="space-y-4">
        {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
        <TruongNhap name="email" type="email" label="Email" required autoComplete="email" defaultValue={emailDaNhap} />
        <TruongNhap name="ma" label="Mã xác nhận" required inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="6 chữ số" />
        <TruongNhap name="matKhauMoi" type="password" label="Mật khẩu mới" required minLength={6} autoComplete="new-password" hint="Tối thiểu 6 ký tự" />
        <TruongNhap name="nhapLai" type="password" label="Nhập lại mật khẩu mới" required autoComplete="new-password" />
        <Nut size="lg" className="w-full" disabled={dangGui}>
          {dangGui ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </Nut>
      </form>
    </KhungXacThuc>
  )
}
