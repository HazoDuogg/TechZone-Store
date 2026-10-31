import { create } from 'zustand'

type ChatState = {
  open: boolean
  show: () => void
  hide: () => void
}

export const useTroLy = create<ChatState>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}))
