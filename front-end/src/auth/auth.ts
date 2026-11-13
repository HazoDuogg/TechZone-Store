import { create } from 'zustand'

export type NguoiDung = {
    id: number
    email: string
    vaiTro: 'khach_hang' | 'nhan_vien' | 'admin'
    hoTen: string | null
    soDienThoai: string | null
}

type AuthState = {
    accessToken: string | null
    user: NguoiDung | null
    login: (data: { accessToken: string; user: NguoiDung }) => void
    setAccessToken: (token: string) => void
    logout: () => void
}

const CAC_VAI_TRO = ['khach_hang', 'nhan_vien', 'admin']

function docNguoiDungDaLuu(): NguoiDung | null {
    try {
        const duLieuTho = localStorage.getItem('user')
        if (!duLieuTho) return null
        const user = JSON.parse(duLieuTho)
        if (user && typeof user.email === 'string' && CAC_VAI_TRO.includes(user.vaiTro)) return user
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
    logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        set({ accessToken: null, user: null })
    },
}))
