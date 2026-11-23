import { useState } from 'react'
import { Nut, TruongNhap, VungNhap, OChon } from '../../components/GiaoDienCoBan'
import OChonTimKiem, { type LuaChon } from '../../components/OChonTimKiem'
import { useDebounce } from '../../hooks/useDebounce'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { SAN_PHAM_MOI, type DongForm } from '../../lib/dongPhieuKho'
import { NHAN_TRANG_THAI_SAN_PHAM } from '../../constants'
import type { DanhMucDayDu, SanPhamKho } from '../../types'

type Props = {
  loai: 'nhap' | 'xuat'
  dong: DongForm
  cacDanhMuc: DanhMucDayDu[]
  coTheXoa: boolean
  onDoi: (thayDoi: Partial<DongForm>) => void
  onXoa: () => void
}

export default function DongPhieuKho({ loai, dong, cacDanhMuc, coTheXoa, onDoi, onXoa }: Props) {
  const laNhap = loai === 'nhap'
  const [tuKhoaGo, setTuKhoaGo] = useState('')
  const laMoi = dong.sanPhamId === SAN_PHAM_MOI
  const tuKhoaTim = useDebounce(laMoi ? dong.ten.trim() : tuKhoaGo.trim(), 300)
  const { duLieu: ketQuaTim = [] } = useTaiDuLieu<SanPhamKho[]>(laMoi && tuKhoaTim.length < 3 ? null : '/phieu-kho/san-pham', { query: tuKhoaTim || undefined })
  const cacTenTuongTu = laMoi && tuKhoaTim.length >= 3 ? ketQuaTim.slice(0, 3) : []
  const cacSanPham = laNhap ? ketQuaTim : ketQuaTim.filter((sp) => sp.tonKho > 0)

  const cacLuaChon: LuaChon[] = [
    ...cacSanPham.map((sp) => ({
      value: String(sp.id),
      label: sp.ten,
      hint: `${sp.danhMuc} · tồn ${sp.tonKho}${sp.trangThai !== 'dang_ban' ? ` · ${NHAN_TRANG_THAI_SAN_PHAM[sp.trangThai]}` : ''}`,
    })),
    ...(laNhap ? [{ value: SAN_PHAM_MOI, label: '＋ Sản phẩm mới', hint: 'Chưa có trong hệ thống' }] : []),
  ]
  const daChonNgoaiKetQua = dong.sanPhamId && !cacLuaChon.some((luaChon) => luaChon.value === dong.sanPhamId) ? [{ value: dong.sanPhamId, label: dong.tenDaChon }] : []

  return (
    <fieldset className="space-y-4 rounded-lg bg-surface p-4">
      <div className="flex items-start gap-2">
        <OChonTimKiem
          className="min-w-0 flex-1"
          label="Sản phẩm"
          options={[...daChonNgoaiKetQua, ...cacLuaChon]}
          value={dong.sanPhamId}
          onChange={(giaTri) =>
            onDoi({
              sanPhamId: giaTri,
              tenDaChon: cacLuaChon.find((luaChon) => luaChon.value === giaTri)?.label ?? '',
              tonKho: cacSanPham.find((sp) => String(sp.id) === giaTri)?.tonKho ?? null,
            })
          }
          onTim={setTuKhoaGo}
          placeholder="Gõ tên để tìm sản phẩm"
          emptyText={laNhap ? 'Không có sản phẩm phù hợp' : 'Không có sản phẩm còn hàng phù hợp'}
        />
        {coTheXoa && (
          <Nut type="button" size="sm" variant="soft" className="mt-7" onClick={onXoa} aria-label="Bỏ dòng này">
            Bỏ
          </Nut>
        )}
      </div>
      {laMoi && (
        <>
          <TruongNhap
            label="Tên sản phẩm mới"
            value={dong.ten}
            onChange={(e) => onDoi({ ten: e.currentTarget.value })}
            required
            placeholder="Ví dụ: ASUS TUF RTX 4070 Ti SUPER 16GB"
          />
          {cacTenTuongTu.length > 0 && (
            <div role="status" className="rounded-md bg-warn/12 px-3 py-2 text-sm text-warn">
              Đã có sản phẩm tương tự: {cacTenTuongTu.map((sp) => sp.ten).join('; ')}. Hãy chọn sản phẩm đã có nếu là cùng một mặt hàng.
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <TruongNhap label="Thương hiệu" value={dong.thuongHieu} onChange={(e) => onDoi({ thuongHieu: e.currentTarget.value })} />
            <OChon label="Danh mục" required value={dong.idDanhMuc} onChange={(e) => onDoi({ idDanhMuc: e.currentTarget.value })}>
              <option value="" disabled>
                Chọn danh mục
              </option>
              {cacDanhMuc.map((danhMuc) => (
                <option key={danhMuc.id} value={danhMuc.id}>
                  {danhMuc.ten}
                </option>
              ))}
            </OChon>
          </div>
        </>
      )}
      <TruongNhap
        type="number"
        min={1}
        max={laNhap ? 500 : Math.min(500, dong.tonKho ?? 500)}
        label="Số lượng"
        required
        value={dong.soLuong}
        onChange={(e) => onDoi({ soLuong: e.currentTarget.value })}
        hint={!laNhap && dong.tonKho !== null ? `Còn ${dong.tonKho} trong kho` : undefined}
      />
      <details>
        <summary className="cursor-pointer text-sm font-semibold text-brand">{laNhap ? 'Nhập serial có sẵn (không bắt buộc)' : 'Chỉ định serial cụ thể (không bắt buộc)'}</summary>
        <VungNhap
          label="Số serial từng chiếc"
          value={dong.serial}
          onChange={(e) => onDoi({ serial: e.currentTarget.value })}
          placeholder={'SN-CPU5600-0001\nSN-CPU5600-0002'}
          className="mt-2"
        />
        <span className="mt-1 block text-sm text-muted">
          {laNhap
            ? 'Để trống thì hệ thống tự cấp số theo dạng SN-MÃ-SỐ. Nếu nhập, mỗi dòng một serial và số dòng bằng số lượng.'
            : 'Để trống thì lấy các chiếc nhập sớm nhất. Với hàng hỏng hoặc mất, nên nhập đúng serial của chiếc đó (mỗi dòng một serial, số dòng bằng số lượng).'}
        </span>
      </details>
    </fieldset>
  )
}
