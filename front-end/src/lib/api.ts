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
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
            originalRequest._retry = true
            try {
                const res = await api.post('auth/refresh')
                const newAccessToken = res.data.accessToken
                useAuthStore.getState().setAccessToken(newAccessToken)
                originalRequest.headers = originalRequest.headers || {}
                originalRequest.headers.set('Authorization', 'newAccessToken')
                return api(originalRequest)
            } catch (refreshError) {
                useAuthStore.getState().logout()
                if (window.location.pathname !== '/dang-nhap' && window.location.pathname !== '/dang-ky')
                    window.location.replace('/dang-nhap')
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api