import { useLocation } from 'react-router-dom'

export const useGocQuanLy = () => (useLocation().pathname.startsWith('/quan-tri') ? '/quan-tri' : '/nhan-vien')
