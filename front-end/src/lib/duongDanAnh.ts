import type { ThongTinSanPham } from '../types'

export const SO_GOC_ANH = 4

const thuMuc: Record<string, string> = {
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
  for (const d of duoi ? [duoi] : ['webp', 'png']) {
    const url = anh[`../assets/images/${duong}.${d}`]
    if (url) return url
  }
  return '/khong-co-anh'
}

export const duongDanAnhSanPham = (p: ThongTinSanPham, goc: number, duoiFile?: 'webp' | 'png') => tim(`san-pham/${thuMuc[p.category]}/${p.id}-${goc}`, duoiFile)

export const duongDanAnhDanhMuc = (ten: string, duoiFile?: 'webp' | 'png') => tim(`danh-muc/cat-${thuMuc[ten]}`, duoiFile)

export const ANH_BANNER = tim('banner/cat-chu')
