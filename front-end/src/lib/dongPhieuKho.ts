export const SAN_PHAM_MOI = 'moi'

export type DongForm = {
  khoa: number
  sanPhamId: string | null
  tenDaChon: string
  tonKho: number | null
  ten: string
  thuongHieu: string
  idDanhMuc: string
  soLuong: string
  serial: string
}

let boDemDong = 0

export const dongMoi = (): DongForm => ({ khoa: ++boDemDong, sanPhamId: null, tenDaChon: '', tonKho: null, ten: '', thuongHieu: '', idDanhMuc: '', soLuong: '1', serial: '' })

export const tachSerial = (chu: string) =>
  chu
    .split(/[\n,;]+/)
    .map((soSerial) => soSerial.trim())
    .filter(Boolean)
