import { useState } from 'react'
import { Nut, TruongNhap, VungNhap, HopThoai, OChon } from '../../components/GiaoDienCoBan'
import VungTaiAnh from '../../components/VungTaiAnh'
import api from '../../lib/api'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { CAC_TRANG_THAI_SAN_PHAM, NHAN_TRANG_THAI_SAN_PHAM } from '../../constants'
import type { DanhMucDayDu, SanPhamQuanTriChiTiet } from '../../types'

const thongSoThanhChu = (thongSo: Record<string, string> | null) =>
  Object.entries(thongSo ?? {})
    .map(([ten, giaTri]) => `${ten}: ${giaTri}`)
    .join('\n')

function chuThanhThongSo(chu: string) {
  const thongSo: Record<string, string> = {}
  for (const dong of chu.split('\n')) {
    if (!dong.trim()) continue
    const viTri = dong.indexOf(':')
    if (viTri < 1) return null
    thongSo[dong.slice(0, viTri).trim()] = dong.slice(viTri + 1).trim()
  }
  return thongSo
}

type Props = {
  idSanPham: number | 'moi'
  cacDanhMuc: DanhMucDayDu[]
  onDong: () => void
  onLuu: () => void
}

function FormSanPham({ chiTiet, cacDanhMuc, onDong, onLuu }: Omit<Props, 'idSanPham'> & { chiTiet?: SanPhamQuanTriChiTiet }) {
  const { dangGui, loi, datLoi, gui } = useGuiForm()
  const [anh, setAnh] = useState<string[]>(() => chiTiet?.anh.map((a) => a.duongDan) ?? [])

  function luu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const thongSo = chuThanhThongSo(String(form.get('thongSo')))
    if (!thongSo) {
      datLoi('Mỗi dòng thông số phải có dạng "Tên: giá trị"')
      return
    }

    const giaNiemYet = String(form.get('giaNiemYet'))
    const duLieu = {
      idDanhMuc: Number(form.get('idDanhMuc')),
      ten: String(form.get('ten')),
      thuongHieu: String(form.get('thuongHieu')),
      gia: Number(form.get('gia')),
      giaNiemYet: giaNiemYet ? Number(giaNiemYet) : null,
      soThangBaoHanh: Number(form.get('soThangBaoHanh')),
      trangThai: String(form.get('trangThai')),
      moTa: String(form.get('moTa')),
      thongSo: Object.keys(thongSo).length > 0 ? thongSo : null,
      anh,
    }
    gui(() => (chiTiet ? api.patch(`/san-pham/${chiTiet.id}`, duLieu) : api.post('/san-pham', duLieu)), onLuu)
  }

  return (
    <form onSubmit={luu} className="space-y-4">
      {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
      <TruongNhap name="ten" label="Tên sản phẩm" required defaultValue={chiTiet?.ten} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TruongNhap name="thuongHieu" label="Thương hiệu" defaultValue={chiTiet?.thuongHieu ?? ''} />
        <OChon name="idDanhMuc" label="Danh mục" required defaultValue={chiTiet?.danhMuc.id ?? cacDanhMuc[0]?.id}>
          {cacDanhMuc.map((dm) => (
            <option key={dm.id} value={dm.id}>
              {dm.ten}
            </option>
          ))}
        </OChon>
        <TruongNhap name="gia" type="number" min={0} label="Giá bán (₫)" required defaultValue={chiTiet?.gia} />
        <TruongNhap
          name="giaNiemYet"
          type="number"
          min={1}
          label="Giá niêm yết (₫)"
          defaultValue={chiTiet?.giaNiemYet ?? ''}
          hint="Để trống nếu không giảm giá. Phải lớn hơn giá bán."
        />
        <TruongNhap name="soThangBaoHanh" type="number" min={0} max={255} label="Bảo hành (tháng)" required defaultValue={chiTiet?.soThangBaoHanh ?? 12} />
        <OChon name="trangThai" label="Trạng thái" defaultValue={chiTiet?.trangThai ?? 'cho_bo_sung'}>
          {CAC_TRANG_THAI_SAN_PHAM.map((tt) => (
            <option key={tt} value={tt}>
              {NHAN_TRANG_THAI_SAN_PHAM[tt]}
            </option>
          ))}
        </OChon>
      </div>
      <p className="-mt-2 text-sm text-muted">Chỉ mở bán (Đang bán) được khi có giá bán lớn hơn 0 và ít nhất một ảnh. "Chờ bổ sung" và "Ngừng bán" ẩn sản phẩm với khách.</p>
      <VungNhap name="moTa" label="Mô tả" defaultValue={chiTiet?.moTa ?? ''} />
      <VungNhap name="thongSo" label="Thông số kỹ thuật" placeholder="Mỗi dòng một thông số, ví dụ: Socket: AM5" defaultValue={thongSoThanhChu(chiTiet?.thongSo ?? null)} />
      <VungTaiAnh
        label="Ảnh sản phẩm"
        value={anh}
        onChange={setAnh}
        multiple
        max={8}
        hint="Ảnh WebP, JPG hoặc PNG, tối đa 2MB mỗi ảnh, tối đa 8 ảnh. Ảnh đầu tiên là ảnh chính hiện ở danh sách."
      />
      <div className="flex justify-end gap-2 pt-2">
        <Nut type="button" variant="soft" onClick={onDong}>
          Hủy
        </Nut>
        <Nut disabled={dangGui}>{dangGui ? 'Đang lưu...' : 'Lưu'}</Nut>
      </div>
    </form>
  )
}

export default function HopThoaiSanPham({ idSanPham, cacDanhMuc, onDong, onLuu }: Props) {
  const laMoi = idSanPham === 'moi'
  const { duLieu: chiTiet, loi: loiTai } = useTaiDuLieu<SanPhamQuanTriChiTiet>(laMoi ? null : `/san-pham/quan-tri/${idSanPham}`)

  return (
    <HopThoai title={laMoi ? 'Thêm sản phẩm' : 'Sửa sản phẩm'} onClose={onDong} wide>
      {loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : !laMoi && !chiTiet ? (
        <p className="text-muted">Đang tải...</p>
      ) : (
        <FormSanPham chiTiet={chiTiet} cacDanhMuc={cacDanhMuc} onDong={onDong} onLuu={onLuu} />
      )}
    </HopThoai>
  )
}
