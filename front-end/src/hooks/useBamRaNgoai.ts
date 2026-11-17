import { useEffect, type RefObject } from 'react'

export function useBamRaNgoai(khung: RefObject<HTMLElement | null>, dangMo: boolean, dong: () => void) {
  useEffect(() => {
    if (!dangMo) return
    const khiBamNgoai = (e: MouseEvent) => {
      if (!khung.current?.contains(e.target as Node)) dong()
    }
    const khiNhanPhim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dong()
    }
    document.addEventListener('mousedown', khiBamNgoai)
    document.addEventListener('keydown', khiNhanPhim)
    return () => {
      document.removeEventListener('mousedown', khiBamNgoai)
      document.removeEventListener('keydown', khiNhanPhim)
    }
  }, [khung, dangMo, dong])
}
