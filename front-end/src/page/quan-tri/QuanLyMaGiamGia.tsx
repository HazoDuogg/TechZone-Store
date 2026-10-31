import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nut, TruongNhap, HopThoai, OChon } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsMaGiamGia, type PhieuGiamGia } from '../../data/duLieuMau'
import { ngayVN, tienVND } from '../../lib/dinhDang'

export default function QuanLyMaGiamGia() {
  const [edit, setEdit] = useState<PhieuGiamGia | 'new' | null>(null)
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(dsMaGiamGia.map((v) => [v.code, v.active])))
  const cur = edit && edit !== 'new' ? edit : undefined

  return (
    <>
      <TieuDeTrang title="Mã giảm giá" desc="Tạo mã, đặt điều kiện áp dụng và bật hoặc tắt khi cần." action={<Nut onClick={() => setEdit('new')}>Tạo mã mới</Nut>} />
      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead><tr><th className={th}>Mã</th><th className={th}>Mức giảm</th><th className={th}>Đơn tối thiểu</th><th className={th}>Hết hạn</th><th className={th}>Kích hoạt</th><th className={th}><span className="sr-only">Thao tác</span></th></tr></thead>
          <tbody>
            {dsMaGiamGia.map((v) => (
              <tr key={v.code}>
                <td className={cx(td, 'font-bold')}>{v.code}</td>
                <td className={td}>{v.kind === 'percent' ? `${v.value}%` : tienVND(v.value)}</td>
                <td className={cx(td, 'whitespace-nowrap')}>{v.minOrder ? tienVND(v.minOrder) : 'Không'}</td>
                <td className={cx(td, 'whitespace-nowrap')}>{ngayVN(v.expires)}</td>
                <td className={td}>
                  <button
                    role="switch"
                    aria-checked={on[v.code]}
                    aria-label={`Bật mã ${v.code}`}
                    onClick={() => setOn((s) => ({ ...s, [v.code]: !s[v.code] }))}
                    className={cx('relative h-6 w-11 rounded-full transition-colors', on[v.code] ? 'bg-ok' : 'bg-surface-2')}
                  >
                    <span className={cx('absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform', on[v.code] && 'translate-x-5')} />
                  </button>
                </td>
                <td className={cx(td, 'whitespace-nowrap')}>
                  <Nut size="sm" variant="soft" onClick={() => setEdit(v)}>Sửa</Nut>{' '}
                  <Nut size="sm" variant="danger">Xóa</Nut>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <HopThoai title={cur ? `Sửa mã ${cur.code}` : 'Tạo mã giảm giá'} onClose={() => setEdit(null)}>
          <form onSubmit={(e) => { e.preventDefault(); setEdit(null) }} className="space-y-4">
            <TruongNhap label="Mã" defaultValue={cur?.code} className="[&_input]:uppercase" />
            <div className="grid gap-4 sm:grid-cols-2">
              <OChon label="Loại giảm" defaultValue={cur?.kind ?? 'percent'}><option value="percent">Theo phần trăm</option><option value="amount">Số tiền cố định</option></OChon>
              <TruongNhap type="number" label="Giá trị" defaultValue={cur?.value} />
              <TruongNhap type="number" label="Đơn tối thiểu (₫)" defaultValue={cur?.minOrder} />
              <TruongNhap type="date" label="Ngày hết hạn" defaultValue={cur?.expires} />
            </div>
            <div className="flex justify-end gap-2 pt-2"><Nut type="button" variant="soft" onClick={() => setEdit(null)}>Hủy</Nut><Nut>Lưu</Nut></div>
          </form>
        </HopThoai>
      )}
    </>
  )
}
