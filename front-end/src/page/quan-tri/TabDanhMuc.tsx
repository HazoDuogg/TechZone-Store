import { useState } from 'react'
import { Nut, TruongNhap, HopThoai, TrangTrong } from '../../components/GiaoDienCoBan'
import VungTaiAnh from '../../components/VungTaiAnh'
import { anhTheoDuongDan } from '../../lib/duongDanAnh'
import api from '../../lib/api'
import { layThongBaoLoi } from '../../lib/thongBaoLoi'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useThongBao } from '../../store/thongBao'
import type { DanhMucDayDu } from '../../types'

export default function TabDanhMuc() {
  const { duLieu: cacDanhMuc = [], dangTai, loi: loiTai, taiLai } = useTaiDuLieu<DanhMucDayDu[]>('/danh-muc')
  const { dangGui, loi, xoaLoi, gui } = useGuiForm()
  const [dangSua, setDangSua] = useState<DanhMucDayDu | 'moi' | null>(null)
  const [anh, setAnh] = useState<string[]>([])
  const hienThongBao = useThongBao((s) => s.hien)
  const danhMucDangSua = dangSua && dangSua !== 'moi' ? dangSua : undefined

  const moForm = (danhMuc: DanhMucDayDu | 'moi') => {
    xoaLoi()
    setAnh(danhMuc !== 'moi' && danhMuc.anhDaiDien ? [danhMuc.anhDaiDien] : [])
    setDangSua(danhMuc)
  }

  function luu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const duLieu = { ten: String(form.get('ten')), moTa: String(form.get('moTa')), anhDaiDien: anh[0] ?? '' }
    gui(
      () => (danhMucDangSua ? api.patch(`/danh-muc/${danhMucDangSua.id}`, duLieu) : api.post('/danh-muc', duLieu)),
      () => {
        setDangSua(null)
        taiLai()
      },
    )
  }

  async function xoa(danhMuc: DanhMucDayDu) {
    if (!window.confirm(`Xóa danh mục ${danhMuc.ten}?`)) return
    try {
      await api.delete(`/danh-muc/${danhMuc.id}`)
      taiLai()
    } catch (err) {
      hienThongBao('Không xóa được danh mục', layThongBaoLoi(err))
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-4 flex justify-end">
        <Nut onClick={() => moForm('moi')}>Thêm danh mục</Nut>
      </div>

      {dangTai ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : cacDanhMuc.length === 0 ? (
        <TrangTrong>Chưa có danh mục nào.</TrangTrong>
      ) : (
        <ul className="space-y-2">
          {cacDanhMuc.map((danhMuc) => (
            <li key={danhMuc.id} className="flex items-center justify-between gap-3 rounded-lg bg-white p-3">
              <span className="flex min-w-0 items-center gap-3">
                {danhMuc.anhDaiDien ? (
                  <img src={anhTheoDuongDan(danhMuc.anhDaiDien)} alt="" className="size-12 shrink-0 rounded-md bg-surface object-cover" />
                ) : (
                  <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-md bg-surface text-lg font-bold text-muted">
                    {danhMuc.ten.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block font-semibold">
                    {danhMuc.ten} <span className="font-normal text-muted">· {danhMuc.soSanPham} sản phẩm</span>
                  </span>
                  {danhMuc.moTa && <span className="block truncate text-sm text-muted">{danhMuc.moTa}</span>}
                </span>
              </span>
              <span className="flex gap-1">
                <Nut size="sm" variant="soft" onClick={() => moForm(danhMuc)}>
                  Sửa
                </Nut>
                <Nut size="sm" variant="danger" onClick={() => xoa(danhMuc)}>
                  Xóa
                </Nut>
              </span>
            </li>
          ))}
        </ul>
      )}

      {dangSua && (
        <HopThoai title={danhMucDangSua ? `Sửa danh mục ${danhMucDangSua.ten}` : 'Thêm danh mục'} onClose={() => setDangSua(null)}>
          <form onSubmit={luu} className="space-y-4">
            {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
            <TruongNhap name="ten" label="Tên danh mục" required defaultValue={danhMucDangSua?.ten} />
            <TruongNhap name="moTa" label="Mô tả (không bắt buộc)" defaultValue={danhMucDangSua?.moTa ?? ''} />
            <VungTaiAnh label="Ảnh danh mục" hint="Ảnh JPG, PNG hoặc WebP, tối đa 2MB. Nên dùng ảnh vuông, hiện ở ô danh mục trang chủ." value={anh} onChange={setAnh} />
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setDangSua(null)}>
                Hủy
              </Nut>
              <Nut disabled={dangGui}>{dangGui ? 'Đang lưu...' : 'Lưu'}</Nut>
            </div>
          </form>
        </HopThoai>
      )}
    </div>
  )
}
