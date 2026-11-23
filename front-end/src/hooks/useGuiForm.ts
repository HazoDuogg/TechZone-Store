import { useState } from 'react'
import { layThongBaoLoi } from '../lib/thongBaoLoi'

export function useGuiForm() {
  const [dangGui, setDangGui] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  async function gui(yeuCau: () => Promise<unknown>, khiXong: () => void) {
    setDangGui(true)
    setLoi(null)
    try {
      await yeuCau()
      khiXong()
    } catch (err) {
      setLoi(layThongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  return { dangGui, loi, datLoi: setLoi, xoaLoi: () => setLoi(null), gui }
}
