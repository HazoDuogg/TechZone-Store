import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { Nhan, Nut, TruongNhap, HopThoai, OChon, NhanTrangThai, VungNhap, ThanhTab } from '../../components/GiaoDienCoBan'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { dsDonHang, dsPhieuBaoHanh } from '../../data/duLieuMau'
import { CAC_TRANG_THAI_BAO_HANH } from '../../constants'
import type { PhieuBaoHanh } from '../../types'
import { ngayVN, timSanPham } from '../../lib/dinhDang'

const BO_LOC_TRANG_THAI = ['Tất cả', ...CAC_TRANG_THAI_BAO_HANH] as const
const CAC_CACH_TRA_CUU = ['Theo serial', 'Theo mã đơn hàng'] as const
const DON_MAU = dsDonHang[1]

export default function BaoHanh() {
  const [daTraCuu, setDaTraCuu] = useState(false)
  const [cachTraCuu, setCachTraCuu] = useState<(typeof CAC_CACH_TRA_CUU)[number]>('Theo serial')
  const [phieuDangSua, setPhieuDangSua] = useState<PhieuBaoHanh | null>(null)
  const [trangThaiLoc, setTrangThaiLoc] = useState<(typeof BO_LOC_TRANG_THAI)[number]>('Tất cả')
  const [moTaLoi, setMoTaLoi] = useState('')
  const [phieuMoi, setPhieuMoi] = useState<PhieuBaoHanh[]>([])

  const tiepNhan = (serial: string, khach: string, moTa: string) => {
    setPhieuMoi((truoc) => [
      {
        id: `BH${String(13 + truoc.length).padStart(4, '0')}`,
        serial,
        customer: khach,
        issue: moTa,
        status: 'Tiếp nhận',
        result: '',
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...truoc,
    ])
    setMoTaLoi('')
    setTrangThaiLoc('Tất cả')
  }

  const danhSach = [...phieuMoi, ...dsPhieuBaoHanh].filter((phieu) => trangThaiLoc === 'Tất cả' || phieu.status === trangThaiLoc)

  return (
    <>
      <TieuDeTrang title="Bảo hành" desc="Tra cứu theo serial hoặc mã đơn hàng, tiếp nhận ngay từ kết quả tra cứu và cập nhật kết quả sửa chữa." />

      <section className="mb-8 rounded-xl bg-white p-5" aria-labelledby="sn">
        <h2 id="sn" className="mb-3 font-bold">
          Tra cứu bảo hành
        </h2>
        <div className="mb-4">
          <ThanhTab
            value={cachTraCuu}
            onChange={(cach) => {
              setCachTraCuu(cach)
              setDaTraCuu(false)
            }}
            items={CAC_CACH_TRA_CUU}
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setDaTraCuu(true)
          }}
          className="flex flex-wrap items-end gap-3"
        >
          {cachTraCuu === 'Theo serial' ? (
            <TruongNhap label="Số serial" placeholder="Ví dụ: SN-RTX4060-77120" className="min-w-0 flex-1 sm:max-w-md" />
          ) : (
            <TruongNhap label="Mã đơn hàng" placeholder="Ví dụ: TZ240002" className="min-w-0 flex-1 sm:max-w-md" />
          )}
          <Nut variant="dark">Tra cứu</Nut>
        </form>
        {daTraCuu && (
          <div className="rise mt-4 rounded-lg bg-surface p-4">
            {cachTraCuu === 'Theo serial' ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">MSI GeForce RTX 4060 VENTUS 2X 8GB</span>
                    <Nhan tone="green">Còn bảo hành</Nhan>
                  </span>
                  <Nut size="sm" disabled={!moTaLoi.trim()} onClick={() => tiepNhan('SN-RTX4060-77120', 'Trần Thu Hà', moTaLoi.trim())}>
                    Tiếp nhận
                  </Nut>
                </div>
                <p className="mt-1 text-[15px] text-muted">Khách: Trần Thu Hà · Mua ngày 19/10/2026 · Bảo hành đến 19/10/2029</p>
              </>
            ) : (
              <p className="text-[15px] text-muted">
                Đơn {DON_MAU.code} · Khách: {DON_MAU.customer} · {DON_MAU.phone}
              </p>
            )}
            <VungNhap label="Tình trạng khách báo" value={moTaLoi} onChange={(e) => setMoTaLoi(e.target.value)} placeholder="Nhập mô tả lỗi rồi bấm Tiếp nhận" className="mt-3" />
            {cachTraCuu === 'Theo mã đơn hàng' && (
              <ul className="mt-3 divide-y divide-surface-2">
                {DON_MAU.items.map((dong) => {
                  const tenSanPham = timSanPham(dong.id)?.name ?? dong.id
                  return (
                    <li key={dong.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <span className="min-w-0">
                        <span className="font-bold">{tenSanPham}</span>
                        <span className="text-muted"> × {dong.qty}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Nhan tone="green">Còn bảo hành</Nhan>
                        <Nut size="sm" disabled={!moTaLoi.trim()} onClick={() => tiepNhan(`Đơn ${DON_MAU.code}`, DON_MAU.customer, `${tenSanPham}: ${moTaLoi.trim()}`)}>
                          Tiếp nhận
                        </Nut>
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </section>

      <div className="mb-4">
        <ThanhTab value={trangThaiLoc} onChange={setTrangThaiLoc} items={BO_LOC_TRANG_THAI} />
      </div>

      <div className={cx(tableWrap, 'bg-white')}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Mã</th>
              <th className={th}>Serial / Đơn</th>
              <th className={th}>Tình trạng báo</th>
              <th className={th}>Ngày nhận</th>
              <th className={th}>Trạng thái</th>
              <th className={th}>
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {danhSach.map((phieu) => (
              <tr key={phieu.id}>
                <td className={cx(td, 'font-bold')}>{phieu.id}</td>
                <td className={td}>
                  {phieu.serial}
                  <div className="text-sm text-muted">{phieu.customer}</div>
                </td>
                <td className={cx(td, 'max-w-72')}>
                  {phieu.issue}
                  {phieu.result && <div className="text-sm text-muted">Kết quả: {phieu.result}</div>}
                </td>
                <td className={cx(td, 'whitespace-nowrap')}>{ngayVN(phieu.createdAt)}</td>
                <td className={td}>
                  <NhanTrangThai status={phieu.status} />
                </td>
                <td className={td}>
                  <Nut size="sm" variant="soft" onClick={() => setPhieuDangSua(phieu)}>
                    Cập nhật
                  </Nut>
                </td>
              </tr>
            ))}
            {danhSach.length === 0 && (
              <tr>
                <td className={cx(td, 'text-center text-muted')} colSpan={6}>
                  Không có phiếu bảo hành nào ở trạng thái "{trangThaiLoc}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {phieuDangSua && (
        <HopThoai title={`Cập nhật ${phieuDangSua.id}`} onClose={() => setPhieuDangSua(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setPhieuDangSua(null)
            }}
            className="space-y-4"
          >
            <p className="text-[15px] text-muted">{phieuDangSua.issue}</p>
            <OChon label="Trạng thái" defaultValue={phieuDangSua.status}>
              {CAC_TRANG_THAI_BAO_HANH.map((trangThai) => (
                <option key={trangThai}>{trangThai}</option>
              ))}
            </OChon>
            <VungNhap label="Kết quả sửa chữa / ghi chú" defaultValue={phieuDangSua.result} />
            <div className="flex justify-end gap-2">
              <Nut type="button" variant="soft" onClick={() => setPhieuDangSua(null)}>
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
