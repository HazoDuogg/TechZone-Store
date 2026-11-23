import { QUYEN_MAC_DINH } from '../constants'
import type { NguoiDung } from '../auth/auth'

export const coQuyen = (nguoiDung: NguoiDung | null, chucNang: string) =>
  nguoiDung?.vaiTro === 'admin' || (nguoiDung?.vaiTro === 'nhan_vien' && !!nguoiDung.viTri && QUYEN_MAC_DINH[nguoiDung.viTri].includes(chucNang))
