import { useEffect, useState } from 'react'
import axios from 'axios'
import api from '../lib/api'
import { layThongBaoLoi } from '../lib/thongBaoLoi'

export type KetQuaTamTinh = {
  tamTinh: number
  tienGiam: number
  phiVanChuyen: number
  tongTien: number
  thongBaoMa: string | null
}

type CacDong = { idSanPham: number; soLuong: number }[]

export function useTamTinh(cacDong: CacDong, maGiamGia: string) {
  const khoa = JSON.stringify([cacDong, maGiamGia])
  const [ketQua, setKetQua] = useState<{ khoa: string; duLieu?: KetQuaTamTinh; loi?: string }>()

  useEffect(() => {
    const [dong, ma] = JSON.parse(khoa) as [CacDong, string]
    if (dong.length === 0) return
    const boHuy = new AbortController()
    const hen = setTimeout(() => {
      api
        .post<KetQuaTamTinh>('/don-hang/tam-tinh', { cacDong: dong, maGiamGia: ma || undefined }, { signal: boHuy.signal })
        .then((res) => setKetQua({ khoa, duLieu: res.data }))
        .catch((err) => {
          if (!axios.isCancel(err)) setKetQua({ khoa, loi: layThongBaoLoi(err, 'Không tính được tổng tiền') })
        })
    }, 300)
    return () => {
      clearTimeout(hen)
      boHuy.abort()
    }
  }, [khoa])

  const hienTai = ketQua?.khoa === khoa ? ketQua : undefined
  return { ketQua: hienTai?.duLieu, loi: hienTai?.loi }
}
