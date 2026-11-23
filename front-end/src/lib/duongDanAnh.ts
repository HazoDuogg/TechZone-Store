import type { SanPham } from '../types'

export const SO_GOC_ANH = 4

export const THU_MUC_ANH: Record<string, string> = {
  CPU: 'cpu',
  Mainboard: 'mainboard',
  RAM: 'ram',
  VGA: 'vga',
  SSD: 'ssd',
  Nguồn: 'nguon',
  Case: 'case',
  'Màn hình': 'man-hinh',
  Chuột: 'chuot',
}

const anh = import.meta.glob<string>('../assets/images/**/*.{webp,png}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const tim = (duong: string, duoi?: 'webp' | 'png') => {
  if (duong.startsWith('uploads/')) return `${import.meta.env.VITE_API_URL}/${duong}`
  for (const d of duoi ? [duoi] : ['webp', 'png']) {
    const url = anh[`../assets/images/${duong}.${d}`]
    if (url) return url
  }
  return '/khong-co-anh'
}

export const anhTheoDuongDan = (duongDan: string) => tim(duongDan)

export const duongDanAnhSanPham = (p: SanPham, goc: number, duoiFile?: 'webp' | 'png') => tim(p.anh[goc - 1]?.duongDan ?? '', duoiFile)

export const ANH_BANNER = tim('banner/cat-chu')
