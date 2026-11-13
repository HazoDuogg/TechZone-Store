import { create } from 'zustand'

type NoiDungThongBao = { id: number; tieuDe: string; noiDung?: string }

type ThongBaoState = {
  thongBao: NoiDungThongBao | null
  hien: (tieuDe: string, noiDung?: string) => void
  an: () => void
}

let boDem = 0

export const useThongBao = create<ThongBaoState>((set) => ({
  thongBao: null,
  hien: (tieuDe, noiDung) => set({ thongBao: { id: ++boDem, tieuDe, noiDung } }),
  an: () => set({ thongBao: null }),
}))
