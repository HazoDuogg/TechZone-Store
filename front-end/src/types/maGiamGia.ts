export type PhieuGiamGia = {
  code: string
  kind: 'percent' | 'amount'
  value: number
  minOrder: number
  expires: string
  active: boolean
}