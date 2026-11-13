import axios from "axios";
import { useAuthStore } from "../auth/auth";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    config.headers = config.headers || {}
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url: string = error.config?.url ?? ''
        const yeuCauXacThuc = url.startsWith('/auth')

        if (error.response?.status === 401 && !yeuCauXacThuc) {
            useAuthStore.getState().logout()
            const duongDan = window.location.pathname
            if (duongDan !== '/dang-nhap' && duongDan !== '/dang-ky') {
                window.location.replace('/dang-nhap')
            }
        }
        return Promise.reject(error)
    }
)

export default api