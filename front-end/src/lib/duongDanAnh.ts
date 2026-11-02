import type { ThongTinSanPham } from '../data/duLieuMau'

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


export const duongDanAnhSanPham = (p: ThongTinSanPham, goc: number) => `/images/san-pham/${thuMuc[p.category]}/${p.id}-${goc}.webp`

export const duongDanAnhDanhMuc = (ten: string, duoiFile: 'webp' | 'png' = 'webp') => `/images/danh-muc/cat-${thuMuc[ten]}.${duoiFile} `

export const ANH_BANNER = '/images/banner/cat-chu.webp'
