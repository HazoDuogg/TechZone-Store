import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SanPham } from '../types'

type MucGioHang = {
  sanPham: SanPham
  soLuong: number
}

type GioHangState = {
  cacMuc: MucGioHang[]
  them: (sanPham: SanPham, soLuong?: number) => void
  doiSoLuong: (id: number, soLuong: number) => void
  xoa: (id: number) => void
  dongBo: (sanPhamMoi: SanPham[]) => string[]
  lamTrong: () => void
}

export const useGioHang = create<GioHangState>()(
  persist(
    (set, get) => ({
      cacMuc: [],
      them: (sanPham, soLuong = 1) =>
        set((s) => {
          const daCo = s.cacMuc.find((m) => m.sanPham.id === sanPham.id)
          if (!daCo) {
            return { cacMuc: [...s.cacMuc, { sanPham, soLuong: Math.min(soLuong, sanPham.tonKho) }] }
          }
          return {
            cacMuc: s.cacMuc.map((m) => (m.sanPham.id === sanPham.id ? { sanPham, soLuong: Math.min(m.soLuong + soLuong, sanPham.tonKho) } : m)),
          }
        }),
      doiSoLuong: (id, soLuong) =>
        set((s) => ({
          cacMuc: s.cacMuc.map((m) => (m.sanPham.id === id ? { ...m, soLuong: Math.max(1, Math.min(soLuong, m.sanPham.tonKho)) } : m)),
        })),
      dongBo: (sanPhamMoi) => {
        const theoId = new Map(sanPhamMoi.map((sp) => [sp.id, sp]))
        const daBo = get()
          .cacMuc.filter((m) => !theoId.has(m.sanPham.id))
          .map((m) => m.sanPham.ten)
        set((s) => ({
          cacMuc: s.cacMuc.flatMap((m) => {
            const sanPham = theoId.get(m.sanPham.id)
            return sanPham ? [{ sanPham, soLuong: Math.max(1, Math.min(m.soLuong, sanPham.tonKho)) }] : []
          }),
        }))
        return daBo
      },
      xoa: (id) => set((s) => ({ cacMuc: s.cacMuc.filter((m) => m.sanPham.id !== id) })),
      lamTrong: () => set({ cacMuc: [] }),
    }),
    { name: 'gioHang' },
  ),
)
