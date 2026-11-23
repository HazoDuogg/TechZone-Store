import { useState } from 'react'
import { Nut, TruongNhap } from '../../components/GiaoDienCoBan'
import api from '../../lib/api'
import { SAN_PHAM_MOI, dongMoi, tachSerial, type DongForm } from '../../lib/dongPhieuKho'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useAuthStore } from '../../auth/auth'
import type { DanhMucDayDu, KetQuaPhanTrang, KetQuaPhieuKho, PhieuKho } from '../../types'
import BangLichSuPhieuKho from './BangLichSuPhieuKho'
import DongPhieuKho from './DongPhieuKho'
import KetQuaPhieu from './KetQuaPhieuKho'

export default function TabNhapKho() {
  const laNhanVien = useAuthStore((s) => s.user?.vaiTro === 'nhan_vien')
  const { duLieu: cacDanhMuc = [] } = useTaiDuLieu<DanhMucDayDu[]>('/danh-muc')
  const [trang, setTrang] = useState(1)
  const { duLieu: lichSu, loi: loiLichSu, taiLai } = useTaiDuLieu<KetQuaPhanTrang<PhieuKho>>('/phieu-kho', { loai: 'nhap', trang, soLuong: 10 })
  const { dangGui, loi, datLoi, xoaLoi, gui } = useGuiForm()
  const [cacDong, setCacDong] = useState<DongForm[]>(() => [dongMoi()])
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
      return {
        ...(dong.sanPhamId === SAN_PHAM_MOI
          ? { sanPhamMoi: { ten: dong.ten, thuongHieu: dong.thuongHieu, idDanhMuc: Number(dong.idDanhMuc) } }
          : { idSanPham: Number(dong.sanPhamId) }),
        soLuong: Number(dong.soLuong),
        ...(cacSerial.length > 0 ? { cacSerial } : {}),
      }
    })

    gui(
      () => api.post<KetQuaPhieuKho>('/phieu-kho/nhap', { ghiChu, cacDong: cacDongGui }).then((res) => setPhieuVuaLap(res.data)),
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
        {phieuVuaLap && <KetQuaPhieu phieu={phieuVuaLap} loai="nhập" onDong={() => setPhieuVuaLap(null)} />}
        {laNhanVien ? (
          <form onSubmit={lapPhieu} className="space-y-4 rounded-xl bg-white p-5">
            {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
            {cacDong.map((dong) => (
              <DongPhieuKho
                key={dong.khoa}
                loai="nhap"
                dong={dong}
                cacDanhMuc={cacDanhMuc}
                coTheXoa={cacDong.length > 1}
                onDoi={(thayDoi) => doiDong(dong.khoa, thayDoi)}
                onXoa={() => setCacDong((truoc) => truoc.filter((d) => d.khoa !== dong.khoa))}
              />
            ))}
            <Nut type="button" variant="soft" size="sm" onClick={() => setCacDong((truoc) => [...truoc, dongMoi()])} disabled={cacDong.length >= 20}>
              ＋ Thêm sản phẩm vào phiếu
            </Nut>
            <TruongNhap label="Ghi chú" value={ghiChu} onChange={(e) => setGhiChu(e.currentTarget.value)} placeholder="Số phiếu nhập, nhà cung cấp" />
            <Nut className="w-full" disabled={dangGui}>
              {dangGui ? 'Đang lập phiếu...' : 'Lập phiếu nhập kho'}
            </Nut>
          </form>
        ) : (
          <p className="rounded-xl bg-white p-5 text-muted">Chỉ nhân viên kho mới lập được phiếu nhập. Quản trị viên xem lịch sử ở bên cạnh.</p>
        )}
      </div>
      <BangLichSuPhieuKho loai="nhap" ketQua={lichSu} loi={loiLichSu} onDoiTrang={setTrang} />
    </div>
  )
}
