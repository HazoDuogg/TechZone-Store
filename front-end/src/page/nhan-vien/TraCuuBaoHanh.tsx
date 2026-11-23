import { useState } from 'react'
import { Nhan, Nut, ThanhTab, TruongNhap, VungNhap } from '../../components/GiaoDienCoBan'
import api from '../../lib/api'
import { ngayVN } from '../../lib/dinhDang'
import { useAuthStore } from '../../auth/auth'
import { useGuiForm } from '../../hooks/useGuiForm'
import type { KetQuaTraCuuBaoHanh, SerialBaoHanh } from '../../types'

const CAC_CACH_TRA_CUU = ['Theo serial', 'Theo mã đơn hàng'] as const

function DongSerial({
  serial,
  moTaLoi,
  dangGui,
  coTheTiepNhan,
  onTiepNhan,
}: {
  serial: SerialBaoHanh
  moTaLoi: string
  dangGui: boolean
  coTheTiepNhan: boolean
  onTiepNhan: () => void
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-3">
      <span className="min-w-0">
        <span className="font-bold">{serial.tenSanPham}</span>
        <span className="block font-mono text-sm text-muted">{serial.soSerial}</span>
        {serial.ngayMua && serial.hanBaoHanh && (
          <span className="block text-sm text-muted">
            Mua {ngayVN(serial.ngayMua)} · bảo hành đến {ngayVN(serial.hanBaoHanh)}
          </span>
        )}
      </span>
      <span className="flex items-center gap-2">
        {serial.duDieuKien ? <Nhan tone="green">Còn bảo hành</Nhan> : <span className="max-w-64 text-right text-sm font-semibold text-danger">{serial.lyDo}</span>}
        {coTheTiepNhan && (
          <Nut size="sm" disabled={!serial.duDieuKien || moTaLoi.trim().length < 5 || dangGui} onClick={onTiepNhan}>
            Tiếp nhận
          </Nut>
        )}
      </span>
    </li>
  )
}

export default function TraCuuBaoHanh({ onTiepNhanXong }: { onTiepNhanXong: (maPhieu: string) => void }) {
  const laNhanVien = useAuthStore((s) => s.user?.vaiTro === 'nhan_vien')
  const [cach, setCach] = useState<(typeof CAC_CACH_TRA_CUU)[number]>('Theo serial')
  const [ketQua, setKetQua] = useState<KetQuaTraCuuBaoHanh | null>(null)
  const [moTaLoi, setMoTaLoi] = useState('')
  const tra = useGuiForm()
  const nhan = useGuiForm()

  function traCuu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const giaTri = String(new FormData(e.currentTarget).get('giaTri')).trim()
    setKetQua(null)
    setMoTaLoi('')
    tra.gui(
      () => api.get<KetQuaTraCuuBaoHanh>('/bao-hanh/tra-cuu', { params: cach === 'Theo serial' ? { soSerial: giaTri } : { maDon: giaTri } }).then((res) => setKetQua(res.data)),
      () => nhan.xoaLoi(),
    )
  }

  function tiepNhan(soSerial: string) {
    let maPhieu = ''
    nhan.gui(
      () => api.post<{ ma: string }>('/bao-hanh', { soSerial, moTaLoi: moTaLoi.trim() }).then((res) => (maPhieu = res.data.ma)),
      () => {
        setKetQua(null)
        setMoTaLoi('')
        onTiepNhanXong(maPhieu)
      },
    )
  }

  return (
    <section className="mb-8 rounded-xl bg-white p-5" aria-labelledby="tra-cuu-bh">
      <h2 id="tra-cuu-bh" className="mb-3 font-bold">
        Tra cứu bảo hành
      </h2>
      <div className="mb-4">
        <ThanhTab
          value={cach}
          onChange={(moi) => {
            setCach(moi)
            setKetQua(null)
            tra.xoaLoi()
          }}
          items={CAC_CACH_TRA_CUU}
        />
      </div>
      <form onSubmit={traCuu} className="flex flex-wrap items-end gap-3">
        <TruongNhap
          key={cach}
          name="giaTri"
          label={cach === 'Theo serial' ? 'Số serial' : 'Mã đơn hàng'}
          placeholder={cach === 'Theo serial' ? 'Ví dụ: SN-CPU5600-0001' : 'Ví dụ: TZ1A2B3C4D'}
          required
          className="min-w-0 flex-1 sm:max-w-md"
        />
        <Nut variant="dark" disabled={tra.dangGui}>
          {tra.dangGui ? 'Đang tra...' : 'Tra cứu'}
        </Nut>
      </form>
      {tra.loi && <p className="mt-3 text-sm font-semibold text-danger">{tra.loi}</p>}

      {ketQua && (
        <div className="rise mt-4 rounded-lg bg-surface p-4">
          {nhan.loi && <p className="mb-3 text-sm font-semibold text-danger">{nhan.loi}</p>}
          {laNhanVien && (
            <VungNhap
              label="Tình trạng khách báo"
              value={moTaLoi}
              onChange={(e) => setMoTaLoi(e.currentTarget.value)}
              placeholder="Nhập mô tả lỗi (ít nhất 5 ký tự) rồi bấm Tiếp nhận"
              className="mb-2"
            />
          )}
          <ul className="divide-y divide-surface-2">
            {ketQua.cacSerial.map((serial) => (
              <DongSerial key={serial.soSerial} serial={serial} moTaLoi={moTaLoi} dangGui={nhan.dangGui} coTheTiepNhan={laNhanVien} onTiepNhan={() => tiepNhan(serial.soSerial)} />
            ))}
          </ul>
          {ketQua.cacSerial[0]?.tenNguoiNhan && (
            <p className="mt-2 text-sm text-muted">
              Đơn {ketQua.cacSerial[0].maDon} · Khách: {ketQua.cacSerial[0].tenNguoiNhan} · {ketQua.cacSerial[0].soDienThoai}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
