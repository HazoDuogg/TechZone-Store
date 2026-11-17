import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SanPham } from "../types";

type MucGioHang = {
    sanPham: SanPham
    soLuong: number
}

type GioHangState = {
    cacMuc: MucGioHang[]
    them: (sanPham: SanPham, soLuong?: number) => void
    doiSoLuong: (id: number, soLuong: number) => void
    xoa: (id: number) => void
    lamTrong: () => void
}

export const useGioHang = create<GioHangState>()(
    persist(
        (set) => ({
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
                    cacMuc: s.cacMuc.map((m) => (m.sanPham.id === id ? { ...m, soLuong: Math.max(1, Math.min(soLuong, m.sanPham.tonKho)) } : m))
                })),
            xoa: (id) => set((s) => ({ cacMuc: s.cacMuc.filter((m) => m.sanPham.id !== id) })),
            lamTrong: () => set({ cacMuc: [] })
        }),
        { name: 'gioHang' }
    )
)