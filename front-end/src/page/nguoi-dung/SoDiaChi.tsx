import { useState } from 'react'
import { HopThoai, Nhan, Nut, TrangTrong, TruongNhap } from '../../components/GiaoDienCoBan'
import api from '../../lib/api'
import { useAuthStore } from '../../auth/auth'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useThongBao } from '../../store/thongBao'
import { layThongBaoLoi } from '../../lib/thongBaoLoi'
import type { DiaChiGiaoHang } from '../../types'

const SO_DIA_CHI_TOI_DA = 10

function HopThoaiDiaChi({ diaChi, onDong, onXong }: { diaChi: DiaChiGiaoHang | null; onDong: () => void; onXong: () => void }) {
  const user = useAuthStore((s) => s.user)
  const { dangGui, loi, gui } = useGuiForm()

  function luu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const duLieu = {
      tenNguoiNhan: String(form.get('tenNguoiNhan')),
      soDienThoai: String(form.get('soDienThoai')).trim(),
      diaChi: String(form.get('diaChi')),
      macDinh: form.get('macDinh') === 'on',
    }
    gui(() => (diaChi ? api.patch(`/khach-hang/toi/dia-chi/${diaChi.id}`, duLieu) : api.post('/khach-hang/toi/dia-chi', duLieu)), onXong)
  }

  return (
    <HopThoai title={diaChi ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'} onClose={onDong}>
      <form onSubmit={luu} className="space-y-4">
        {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
        <TruongNhap name="tenNguoiNhan" label="Tên người nhận" defaultValue={diaChi?.tenNguoiNhan ?? user?.hoTen ?? ''} required autoFocus />
        <TruongNhap name="soDienThoai" label="Số điện thoại" defaultValue={diaChi?.soDienThoai ?? user?.soDienThoai ?? ''} required inputMode="tel" />
        <TruongNhap name="diaChi" label="Địa chỉ" defaultValue={diaChi?.diaChi ?? ''} required placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
        {!diaChi?.macDinh && (
          <label className="flex items-center gap-2 text-[15px]">
            <input type="checkbox" name="macDinh" className="size-4 accent-brand" />
            Đặt làm địa chỉ mặc định
          </label>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Nut type="button" variant="soft" onClick={onDong}>
            Hủy
          </Nut>
          <Nut disabled={dangGui}>{dangGui ? 'Đang lưu...' : 'Lưu địa chỉ'}</Nut>
        </div>
      </form>
    </HopThoai>
  )
}

export default function SoDiaChi() {
  const hienThongBao = useThongBao((s) => s.hien)
  const { duLieu: cacDiaChi, loi: loiTai, taiLai } = useTaiDuLieu<DiaChiGiaoHang[]>('/khach-hang/toi/dia-chi')
  const [dangSua, setDangSua] = useState<DiaChiGiaoHang | 'moi' | null>(null)
  const [dangXoa, setDangXoa] = useState<DiaChiGiaoHang | null>(null)

  if (loiTai) return <p className="font-semibold text-danger">{loiTai}</p>
  if (!cacDiaChi) return <TrangTrong>Đang tải...</TrangTrong>

  async function thucHien(yeuCau: () => Promise<unknown>, tieuDeLoi: string) {
    try {
      await yeuCau()
      taiLai()
    } catch (err) {
      hienThongBao(tieuDeLoi, layThongBaoLoi(err))
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">
          {cacDiaChi.length}/{SO_DIA_CHI_TOI_DA} địa chỉ. Địa chỉ mặc định sẽ được điền sẵn khi đặt hàng.
        </p>
        <Nut onClick={() => setDangSua('moi')} disabled={cacDiaChi.length >= SO_DIA_CHI_TOI_DA}>
          ＋ Thêm địa chỉ
        </Nut>
      </div>

      {cacDiaChi.length === 0 ? (
        <TrangTrong>Bạn chưa lưu địa chỉ nào.</TrangTrong>
      ) : (
        <ul className="space-y-3">
          {cacDiaChi.map((dc) => (
            <li key={dc.id} className="rounded-lg bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">{dc.tenNguoiNhan}</span>
                    <span className="text-muted">{dc.soDienThoai}</span>
                    {dc.macDinh && <Nhan tone="green">Mặc định</Nhan>}
                  </div>
                  <p className="mt-1 text-[15px]">{dc.diaChi}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!dc.macDinh && (
                    <Nut
                      size="sm"
                      variant="soft"
                      onClick={() => thucHien(() => api.patch(`/khach-hang/toi/dia-chi/${dc.id}`, { macDinh: true }), 'Không đặt được địa chỉ mặc định')}
                    >
                      Đặt mặc định
                    </Nut>
                  )}
                  <Nut size="sm" variant="soft" onClick={() => setDangSua(dc)}>
                    Sửa
                  </Nut>
                  <Nut size="sm" variant="danger" onClick={() => setDangXoa(dc)}>
                    Xóa
                  </Nut>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {dangSua && (
        <HopThoaiDiaChi
          diaChi={dangSua === 'moi' ? null : dangSua}
          onDong={() => setDangSua(null)}
          onXong={() => {
            setDangSua(null)
            taiLai()
          }}
        />
      )}

      {dangXoa && (
        <HopThoai title="Xóa địa chỉ" onClose={() => setDangXoa(null)}>
          <p>
            Xóa địa chỉ của <b>{dangXoa.tenNguoiNhan}</b>?{dangXoa.macDinh && ' Địa chỉ mới nhất còn lại sẽ trở thành mặc định.'}
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Nut variant="soft" onClick={() => setDangXoa(null)}>
              Giữ lại
            </Nut>
            <Nut
              variant="danger"
              onClick={() => {
                const idXoa = dangXoa.id
                setDangXoa(null)
                thucHien(() => api.delete(`/khach-hang/toi/dia-chi/${idXoa}`), 'Không xóa được địa chỉ')
              }}
            >
              Xóa
            </Nut>
          </div>
        </HopThoai>
      )}
    </>
  )
}
