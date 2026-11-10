import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nut, TruongNhap, HopThoai, OChon } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsMaGiamGia } from '../../data/duLieuMau'
import type { PhieuGiamGia } from '../../types'
import { ngayVN, tienVND } from '../../lib/dinhDang'

export default function QuanLyMaGiamGia() {
  const [dangSua, setDangSua] = useState<PhieuGiamGia | 'moi' | null>(null)
  const [dangBat, setDangBat] = useState<Record<string, boolean>>(Object.fromEntries(dsMaGiamGia.map((ma) => [ma.code, ma.active])))
  const maDangSua = dangSua && dangSua !== 'moi' ? dangSua : undefined

  return (
    <>
      <TieuDeTrang title="Mã giảm giá" desc="Tạo mã, đặt điều kiện áp dụng và bật hoặc tắt khi cần." action={<Nut onClick={() => setDangSua('moi')}>Tạo mã mới</Nut>} />
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
            {dsMaGiamGia.map((ma) => (
              <tr key={ma.code}>
                <td className={cx(td, 'font-bold')}>{ma.code}</td>
                <td className={td}>{ma.kind === 'percent' ? `${ma.value}%` : tienVND(ma.value)}</td>
                <td className={cx(td, 'whitespace-nowrap')}>{ma.minOrder ? tienVND(ma.minOrder) : 'Không'}</td>
                <td className={cx(td, 'whitespace-nowrap')}>{ngayVN(ma.expires)}</td>
                <td className={td}>
                  <button
                    role="switch"
                    aria-checked={dangBat[ma.code]}
                    aria-label={`Bật mã ${ma.code}`}
                    onClick={() => setDangBat((truoc) => ({ ...truoc, [ma.code]: !truoc[ma.code] }))}
                    className={cx('relative h-6 w-11 rounded-full transition-colors', dangBat[ma.code] ? 'bg-ok' : 'bg-surface-2')}
                  >
                    <span className={cx('absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform', dangBat[ma.code] && 'translate-x-5')} />
                  </button>
                </td>
                <td className={cx(td, 'whitespace-nowrap')}>
                  <Nut size="sm" variant="soft" onClick={() => setDangSua(ma)}>
                    Sửa
                  </Nut>{' '}
                  <Nut size="sm" variant="danger">
                    Xóa
                  </Nut>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dangSua && (
        <HopThoai title={maDangSua ? `Sửa mã ${maDangSua.code}` : 'Tạo mã giảm giá'} onClose={() => setDangSua(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDangSua(null)
            }}
            className="space-y-4"
          >
            <TruongNhap label="Mã" defaultValue={maDangSua?.code} className="[&_input]:uppercase" />
            <div className="grid gap-4 sm:grid-cols-2">
              <OChon label="Loại giảm" defaultValue={maDangSua?.kind ?? 'percent'}>
                <option value="percent">Theo phần trăm</option>
                <option value="amount">Số tiền cố định</option>
              </OChon>
              <TruongNhap type="number" label="Giá trị" defaultValue={maDangSua?.value} />
              <TruongNhap type="number" label="Đơn tối thiểu (₫)" defaultValue={maDangSua?.minOrder} />
              <TruongNhap type="date" label="Ngày hết hạn" defaultValue={maDangSua?.expires} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Nut type="button" variant="soft" onClick={() => setDangSua(null)}>
                Hủy
              </Nut>
              <Nut>Lưu</Nut>
            </div>
          </form>
        </HopThoai>
      )}
    </>
  )
}
