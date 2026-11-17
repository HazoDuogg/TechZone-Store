import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nut, TruongNhap, HopThoai, OChon, TrangTrong } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import type { MaGiamGia } from '../../types'
import { ngayVN, tienVND } from '../../lib/dinhDang'
import api from '../../lib/api'
import { layThongBaoLoi } from '../../lib/thongBaoLoi'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useThongBao } from '../../store/thongBao'

export default function QuanLyMaGiamGia() {
  const { duLieu: dsMa = [], dangTai, loi: loiTai, taiLai } = useTaiDuLieu<MaGiamGia[]>('/ma-giam-gia')
  const [dangSua, setDangSua] = useState<MaGiamGia | 'moi' | null>(null)
  const [loiForm, setLoiForm] = useState<string | null>(null)
  const [dangLuu, setDangLuu] = useState(false)
  const hienThongBao = useThongBao((s) => s.hien)
  const maDangSua = dangSua && dangSua !== 'moi' ? dangSua : undefined

  const moForm = (ma: MaGiamGia | 'moi') => {
    setLoiForm(null)
    setDangSua(ma)
  }

  async function luu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const duLieu = {
      ma: String(form.get('ma')),
      loai: String(form.get('loai')),
      giaTri: Number(form.get('giaTri')),
      donToiThieu: Number(form.get('donToiThieu') || 0),
      ngayHetHan: String(form.get('ngayHetHan')),
    }

    setDangLuu(true)
    setLoiForm(null)
    try {
      if (maDangSua) await api.patch(`/ma-giam-gia/${maDangSua.id}`, duLieu)
      else await api.post('/ma-giam-gia', duLieu)
      setDangSua(null)
      taiLai()
    } catch (err) {
      setLoiForm(layThongBaoLoi(err))
    } finally {
      setDangLuu(false)
    }
  }

  async function doiHoatDong(ma: MaGiamGia) {
    try {
      await api.patch(`/ma-giam-gia/${ma.id}`, { hoatDong: !ma.hoatDong })
      taiLai()
    } catch (err) {
      hienThongBao('Không đổi được trạng thái', layThongBaoLoi(err))
    }
  }

  async function xoa(ma: MaGiamGia) {
    if (!window.confirm(`Xóa mã ${ma.ma}?`)) return
    try {
      await api.delete(`/ma-giam-gia/${ma.id}`)
      taiLai()
    } catch (err) {
      hienThongBao('Không xóa được mã', layThongBaoLoi(err))
    }
  }

  return (
    <>
      <TieuDeTrang title="Mã giảm giá" desc="Tạo mã, đặt điều kiện áp dụng và bật hoặc tắt khi cần." action={<Nut onClick={() => setDangSua('moi')}>Tạo mã mới</Nut>} />
      {dangTai ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : dsMa.length === 0 ? (
        <TrangTrong>Chưa có mã giảm giá nào.</TrangTrong>
      ) : (
        <div className={cx(tableWrap, 'bg-white')}>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Mã</th>
                <th className={th}>Mức giảm</th>
                <th className={th}>Đơn tối thiểu</th>
                <th className={th}>Hết hạn</th>
                <th className={th}>Kích hoạt</th>
                <th className={th}>
                  <span className="sr-only">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {dsMa.map((ma) => (
                <tr key={ma.id}>
                  <td className={cx(td, 'font-bold')}>{ma.ma}</td>
                  <td className={td}>{ma.loai === 'phan_tram' ? `${ma.giaTri}%` : tienVND(ma.giaTri)}</td>
                  <td className={cx(td, 'whitespace-nowrap')}>{ma.donToiThieu ? tienVND(ma.donToiThieu) : 'Không'}</td>
                  <td className={cx(td, 'whitespace-nowrap')}>{ma.ngayHetHan ? ngayVN(ma.ngayHetHan) : 'Không giới hạn'}</td>
                  <td className={td}>
                    <button
                      role="switch"
                      aria-checked={ma.hoatDong}
                      aria-label={`Bật mã ${ma.ma}`}
                      onClick={() => doiHoatDong(ma)}
                      className={cx('relative h-6 w-11 rounded-full transition-colors', ma.hoatDong ? 'bg-ok' : 'bg-surface-2')}
                    >
                      <span className={cx('absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform', ma.hoatDong && 'translate-x-5')} />
                    </button>
                  </td>
                  <td className={cx(td, 'whitespace-nowrap')}>
                    <Nut size="sm" variant="soft" onClick={() => moForm(ma)}>
                      Sửa
                    </Nut>{' '}
                    <Nut size="sm" variant="danger" onClick={() => xoa(ma)}>
                      Xóa
                    </Nut>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dangSua && (
        <HopThoai title={maDangSua ? `Sửa mã ${maDangSua.ma}` : 'Tạo mã giảm giá'} onClose={() => setDangSua(null)}>
          <form onSubmit={luu} className="space-y-4">
            {loiForm && <p className="text-sm font-semibold text-danger">{loiForm}</p>}
            <TruongNhap name="ma" label="Mã" required defaultValue={maDangSua?.ma} className="[&_input]:uppercase" />
            <div className="grid gap-4 sm:grid-cols-2">
              <OChon name="loai" label="Loại giảm" defaultValue={maDangSua?.loai ?? 'phan_tram'}>
                <option value="phan_tram">Theo phần trăm</option>
                <option value="so_tien">Số tiền cố định</option>
              </OChon>
              <TruongNhap name="giaTri" type="number" min={1} label="Giá trị" required defaultValue={maDangSua?.giaTri} />
              <TruongNhap name="donToiThieu" type="number" min={0} label="Đơn tối thiểu (₫)" defaultValue={maDangSua?.donToiThieu ?? 0} />
              <TruongNhap name="ngayHetHan" type="date" label="Ngày hết hạn" defaultValue={maDangSua?.ngayHetHan ?? ''} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setDangSua(null)}>
                Hủy
              </Nut>
              <Nut disabled={dangLuu}>{dangLuu ? 'Đang lưu...' : 'Lưu'}</Nut>
            </div>
          </form>
        </HopThoai>
      )}
    </>
  )
}
