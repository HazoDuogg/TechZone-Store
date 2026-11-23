import { create } from 'zustand'
import { CAC_VI_TRI, type ViTri } from '../constants'

export type NguoiDung = {
  id: number
  email: string
  vaiTro: 'khach_hang' | 'nhan_vien' | 'admin'
  hoTen: string | null
  soDienThoai: string | null
  viTri?: ViTri
}

type AuthState = {
  accessToken: string | null
  user: NguoiDung | null
  login: (data: { accessToken: string; user: NguoiDung }) => void
  setAccessToken: (token: string) => void
  capNhatNguoiDung: (thongTin: Partial<NguoiDung>) => void
  logout: () => void
}

const CAC_VAI_TRO = ['khach_hang', 'nhan_vien', 'admin']

function docNguoiDungDaLuu(): NguoiDung | null {
  try {
    const duLieuTho = localStorage.getItem('user')
    if (!duLieuTho) return null
    const user = JSON.parse(duLieuTho)
    const hopLe = user && typeof user.email === 'string' && CAC_VAI_TRO.includes(user.vaiTro)
    if (hopLe && (user.vaiTro !== 'nhan_vien' || CAC_VI_TRI.includes(user.viTri))) return user
  } catch (error) {
    console.error('Lỗi khi đọc thông tin người dùng:', error)
  }
  localStorage.removeItem('user')
  localStorage.removeItem('accessToken')
  return null
}

const nguoiDungDaLuu = docNguoiDungDaLuu()

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: nguoiDungDaLuu ? localStorage.getItem('accessToken') : null,
  user: nguoiDungDaLuu,
  login: ({ accessToken, user }) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(user))
    set({ accessToken, user })
  },
  setAccessToken(token) {
    localStorage.setItem('accessToken', token)
    set({ accessToken: token })
  },
  capNhatNguoiDung(thongTin) {
    const user = useAuthStore.getState().user
    if (!user) return
    const moi = { ...user, ...thongTin }
    localStorage.setItem('user', JSON.stringify(moi))
    set({ user: moi })
  },
  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    set({ accessToken: null, user: null })
  },
}))
