import { useEffect } from 'react'
import { useTaiDuLieu } from './useTaiDuLieu'
import { useGioHang } from '../store/gioHang'
import { useThongBao } from '../store/thongBao'
import type { SanPham } from '../types'

export function useDongBoGioHang() {
  const cacMuc = useGioHang((s) => s.cacMuc)
  const dongBo = useGioHang((s) => s.dongBo)
  const hienThongBao = useThongBao((s) => s.hien)
  const ids = cacMuc
    .map((muc) => muc.sanPham.id)
    .sort((a, b) => a - b)
    .join(',')
  const { duLieu } = useTaiDuLieu<SanPham[]>(ids ? '/san-pham/theo-ids' : null, { ids })

  useEffect(() => {
    if (!duLieu) return
    const daBo = dongBo(duLieu)
    if (daBo.length > 0) hienThongBao('Giỏ hàng đã được cập nhật', `${daBo.join(', ')} đã ngừng bán nên được bỏ khỏi giỏ.`)
  }, [duLieu, dongBo, hienThongBao])
}
