import { useEffect, useState } from 'react'
import axios from 'axios'
import api from '../lib/api'
import { layThongBaoLoi } from '../lib/thongBaoLoi'

type KetQua<T> = { khoa: string; duLieu?: T; loi?: string }

export function useTaiDuLieu<T>(url: string | null, thamSo?: Record<string, unknown>) {
  const [ketQua, setKetQua] = useState<KetQua<T>>()
  const [lanTai, setLanTai] = useState(0)
  const khoaThamSo = JSON.stringify(thamSo ?? {})
  const khoaHienTai = url === null ? null : url + khoaThamSo

  useEffect(() => {
    if (url === null) return
    const khoa = url + khoaThamSo
    const boHuy = new AbortController()
    api
      .get<T>(url, { params: JSON.parse(khoaThamSo), signal: boHuy.signal })
      .then((res) => setKetQua({ khoa, duLieu: res.data }))
      .catch((err) => {
        if (!axios.isCancel(err)) setKetQua({ khoa, loi: layThongBaoLoi(err, 'Không tải được dữ liệu') })
      })
    return () => boHuy.abort()
  }, [url, khoaThamSo, lanTai])

  return {
    duLieu: ketQua?.duLieu,
    loi: ketQua?.khoa === khoaHienTai ? ketQua?.loi : undefined,
    dangTai: url !== null && ketQua?.khoa !== khoaHienTai,
    taiLai: () => setLanTai((n) => n + 1),
  }
}
