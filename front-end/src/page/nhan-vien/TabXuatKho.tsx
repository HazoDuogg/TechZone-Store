import { useState } from 'react'
import { Nut, OChon, TruongNhap } from '../../components/GiaoDienCoBan'
import api from '../../lib/api'
import { dongMoi, tachSerial, type DongForm } from '../../lib/dongPhieuKho'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useAuthStore } from '../../auth/auth'
import { CAC_LY_DO_XUAT_KHO, NHAN_LY_DO_XUAT_KHO, type LyDoXuatKho } from '../../constants'
import type { KetQuaPhanTrang, KetQuaPhieuKho, PhieuKho } from '../../types'
import BangLichSuPhieuKho from './BangLichSuPhieuKho'
import DongPhieuKho from './DongPhieuKho'
import KetQuaPhieu from './KetQuaPhieuKho'

export default function TabXuatKho() {
  const laNhanVien = useAuthStore((s) => s.user?.vaiTro === 'nhan_vien')
  const [trang, setTrang] = useState(1)
  const { duLieu: lichSu, loi: loiLichSu, taiLai } = useTaiDuLieu<KetQuaPhanTrang<PhieuKho>>('/phieu-kho', { loai: 'xuat', trang, soLuong: 10 })
  const { dangGui, loi, datLoi, xoaLoi, gui } = useGuiForm()
  const [cacDong, setCacDong] = useState<DongForm[]>(() => [dongMoi()])
  const [lyDo, setLyDo] = useState<LyDoXuatKho>('hang_hong')
  const [ghiChu, setGhiChu] = useState('')
  const [phieuVuaLap, setPhieuVuaLap] = useState<KetQuaPhieuKho | null>(null)

  const doiDong = (khoa: number, thayDoi: Partial<DongForm>) => {
    xoaLoi()
    setCacDong((truoc) => truoc.map((dong) => (dong.khoa === khoa ? { ...dong, ...thayDoi } : dong)))
  }

  function lapPhieu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (cacDong.some((dong) => !dong.sanPhamId)) {
      datLoi('Hãy chọn sản phẩm cho tất cả các dòng')
      return
    }

    const cacDongGui = cacDong.map((dong) => {
      const cacSerial = tachSerial(dong.serial)
      return { idSanPham: Number(dong.sanPhamId), soLuong: Number(dong.soLuong), ...(cacSerial.length > 0 ? { cacSerial } : {}) }
    })

    gui(
      () => api.post<KetQuaPhieuKho>('/phieu-kho/xuat', { lyDo, ghiChu, cacDong: cacDongGui }).then((res) => setPhieuVuaLap(res.data)),
      () => {
        setCacDong([dongMoi()])
        setGhiChu('')
        setTrang(1)
        taiLai()
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[28rem_1fr]">
      <div className="h-fit space-y-4">
        {phieuVuaLap && <KetQuaPhieu phieu={phieuVuaLap} loai="xuất" onDong={() => setPhieuVuaLap(null)} />}
        {laNhanVien ? (
          <form onSubmit={lapPhieu} className="space-y-4 rounded-xl bg-white p-5">
            {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
            <OChon label="Lý do xuất" value={lyDo} onChange={(e) => setLyDo(e.currentTarget.value as LyDoXuatKho)}>
              {CAC_LY_DO_XUAT_KHO.map((ma) => (
                <option key={ma} value={ma}>
                  {NHAN_LY_DO_XUAT_KHO[ma]}
                </option>
              ))}
            </OChon>
            {cacDong.map((dong) => (
              <DongPhieuKho
                key={dong.khoa}
                loai="xuat"
                dong={dong}
                cacDanhMuc={[]}
                coTheXoa={cacDong.length > 1}
                onDoi={(thayDoi) => doiDong(dong.khoa, thayDoi)}
                onXoa={() => setCacDong((truoc) => truoc.filter((d) => d.khoa !== dong.khoa))}
              />
            ))}
            <Nut type="button" variant="soft" size="sm" onClick={() => setCacDong((truoc) => [...truoc, dongMoi()])} disabled={cacDong.length >= 20}>
              ＋ Thêm sản phẩm vào phiếu
            </Nut>
            <TruongNhap label="Ghi chú" value={ghiChu} onChange={(e) => setGhiChu(e.currentTarget.value)} placeholder="Mô tả thêm (không bắt buộc)" />
            <p className="text-sm text-muted">Các chiếc đã xuất sẽ chuyển sang trạng thái lỗi và không còn tính vào tồn kho.</p>
            <Nut className="w-full" variant="danger" disabled={dangGui}>
              {dangGui ? 'Đang lập phiếu...' : 'Lập phiếu xuất kho'}
            </Nut>
          </form>
        ) : (
          <p className="rounded-xl bg-white p-5 text-muted">Chỉ nhân viên kho mới lập được phiếu xuất. Quản trị viên xem lịch sử ở bên cạnh.</p>
        )}
      </div>
      <BangLichSuPhieuKho loai="xuat" ketQua={lichSu} loi={loiLichSu} onDoiTrang={setTrang} />
    </div>
  )
}
