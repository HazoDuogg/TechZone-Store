import { useState } from 'react'
import { HopThoai, NhanTrangThai, Nut, OChon, TrangTrong, VungNhap } from '../../components/GiaoDienCoBan'
import PhanTrang from '../../components/PhanTrang'
import api from '../../lib/api'
import { ngayVN } from '../../lib/dinhDang'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { useAuthStore } from '../../auth/auth'
import { useDebounce } from '../../hooks/useDebounce'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { BUOC_TIEP_BAO_HANH, CAC_TRANG_THAI_BAO_HANH, NHAN_TRANG_THAI_BAO_HANH, type TrangThaiBaoHanh } from '../../constants'
import type { KetQuaPhanTrang, PhieuBaoHanh } from '../../types'

const BO_LOC_TRANG_THAI: { gia: TrangThaiBaoHanh | ''; nhan: string }[] = [
  { gia: '', nhan: 'Tất cả' },
  ...CAC_TRANG_THAI_BAO_HANH.map((tt) => ({ gia: tt, nhan: NHAN_TRANG_THAI_BAO_HANH[tt] })),
]

function HopThoaiCapNhat({ phieu, onDong, onXong }: { phieu: PhieuBaoHanh; onDong: () => void; onXong: () => void }) {
  const { dangGui, loi, gui } = useGuiForm()
  const cacBuoc = BUOC_TIEP_BAO_HANH[phieu.trangThai]

  function luu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    gui(() => api.patch(`/bao-hanh/${phieu.id}`, { trangThai: String(form.get('trangThai')), ketQua: String(form.get('ketQua')) }), onXong)
  }

  return (
    <HopThoai title={`Cập nhật ${phieu.ma}`} onClose={onDong}>
      <form onSubmit={luu} className="space-y-4">
        {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
        <p className="text-[15px] text-muted">
          {phieu.tenSanPham} · <span className="font-mono">{phieu.soSerial}</span>
          <br />
          Khách báo: {phieu.moTaLoi}
        </p>
        <OChon name="trangThai" label="Trạng thái" defaultValue={phieu.trangThai}>
          {cacBuoc.map((tt) => (
            <option key={tt} value={tt}>
              {NHAN_TRANG_THAI_BAO_HANH[tt]}
              {tt === phieu.trangThai ? ' (giữ nguyên, chỉ ghi chú thêm)' : ''}
            </option>
          ))}
        </OChon>
        <VungNhap name="ketQua" label="Kết quả xử lý / ghi chú" defaultValue={phieu.ketQua ?? ''} placeholder="Bắt buộc khi hoàn tất hoặc từ chối (ít nhất 5 ký tự)" />
        <div className="flex justify-end gap-2">
          <Nut type="button" variant="soft" onClick={onDong}>
            Hủy
          </Nut>
          <Nut disabled={dangGui}>{dangGui ? 'Đang lưu...' : 'Lưu'}</Nut>
        </div>
      </form>
    </HopThoai>
  )
}

export default function DanhSachBaoHanh() {
  const laNhanVien = useAuthStore((s) => s.user?.vaiTro === 'nhan_vien')
  const [trangThaiLoc, setTrangThaiLoc] = useState<TrangThaiBaoHanh | ''>('')
  const [tuKhoa, setTuKhoa] = useState('')
  const [trang, setTrang] = useState(1)
  const [phieuDangSua, setPhieuDangSua] = useState<PhieuBaoHanh | null>(null)
  const tuKhoaTre = useDebounce(tuKhoa.trim(), 300)

  const {
    duLieu: ketQua,
    loi: loiTai,
    taiLai,
  } = useTaiDuLieu<KetQuaPhanTrang<PhieuBaoHanh>>('/bao-hanh', {
    trangThai: trangThaiLoc || undefined,
    query: tuKhoaTre || undefined,
    trang,
    soLuong: 20,
  })

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {BO_LOC_TRANG_THAI.map((boLoc) => (
            <button
              key={boLoc.gia}
              onClick={() => {
                setTrangThaiLoc(boLoc.gia)
                setTrang(1)
              }}
              className={cx('rounded-md px-3 py-2 text-sm font-semibold transition-colors', trangThaiLoc === boLoc.gia ? 'bg-ink text-white' : 'bg-white hover:bg-surface-2')}
            >
              {boLoc.nhan}
            </button>
          ))}
        </div>
        <input
          placeholder="Tìm theo serial, mã đơn, tên, số điện thoại"
          aria-label="Tìm phiếu bảo hành"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.currentTarget.value)
            setTrang(1)
          }}
          className="h-10 w-full rounded-md bg-white px-3 text-[15px] focus:outline-2 focus:outline-brand sm:w-80"
        />
      </div>

      {loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : !ketQua ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : ketQua.duLieu.length === 0 ? (
        <TrangTrong>Không có phiếu bảo hành nào.</TrangTrong>
      ) : (
        <>
          <div className={cx(tableWrap, 'bg-white')}>
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>Mã</th>
                  <th className={th}>Sản phẩm / Serial</th>
                  <th className={th}>Tình trạng báo</th>
                  <th className={th}>Ngày nhận</th>
                  <th className={th}>Trạng thái</th>
                  <th className={th}>
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ketQua.duLieu.map((phieu) => (
                  <tr key={phieu.id}>
                    <td className={cx(td, 'font-bold')}>{phieu.ma}</td>
                    <td className={cx(td, 'min-w-56')}>
                      <div className="font-medium">{phieu.tenSanPham}</div>
                      <div className="font-mono text-sm text-muted">{phieu.soSerial}</div>
                      <div className="text-sm text-muted">
                        {phieu.tenNguoiNhan} · {phieu.soDienThoai}
                      </div>
                    </td>
                    <td className={cx(td, 'max-w-72')}>
                      {phieu.moTaLoi}
                      {phieu.ketQua && <div className="text-sm text-muted">Kết quả: {phieu.ketQua}</div>}
                    </td>
                    <td className={cx(td, 'whitespace-nowrap')}>{ngayVN(phieu.ngayTiepNhan)}</td>
                    <td className={td}>
                      <NhanTrangThai status={NHAN_TRANG_THAI_BAO_HANH[phieu.trangThai]} />
                    </td>
                    <td className={td}>
                      {laNhanVien && BUOC_TIEP_BAO_HANH[phieu.trangThai].length > 0 && (
                        <Nut size="sm" variant="soft" onClick={() => setPhieuDangSua(phieu)}>
                          Cập nhật
                        </Nut>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PhanTrang trang={ketQua.trang} tongTrang={ketQua.tongTrang} tong={ketQua.tong} donVi="phiếu" onDoiTrang={setTrang} />
        </>
      )}

      {phieuDangSua && (
        <HopThoaiCapNhat
          phieu={phieuDangSua}
          onDong={() => setPhieuDangSua(null)}
          onXong={() => {
            setPhieuDangSua(null)
            taiLai()
          }}
        />
      )}
    </>
  )
}
