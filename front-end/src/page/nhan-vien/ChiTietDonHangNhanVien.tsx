import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TieuDeTrang } from '../../components/BoCuc'
import { NoiDungDonHang } from '../../components/HienThiDonHang'
import { Nhan, Nut, TrangTrong, HopThoai, TruongNhap } from '../../components/GiaoDienCoBan'
import api from '../../lib/api'
import { layThongBaoLoi } from '../../lib/thongBaoLoi'
import { useGocQuanLy } from '../../lib/gocQuanLy'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useThongBao } from '../../store/thongBao'
import type { TrangThaiDon } from '../../constants'
import type { DonHangChiTiet } from '../../types'

const BUOC_TIEP: Partial<Record<TrangThaiDon, { trangThai: TrangThaiDon; nhan: string }>> = {
  cho_xac_nhan: { trangThai: 'da_xac_nhan', nhan: 'Xác nhận đơn' },
  da_xac_nhan: { trangThai: 'dang_giao', nhan: 'Bắt đầu giao hàng' },
  dang_giao: { trangThai: 'hoan_tat', nhan: 'Hoàn tất đơn' },
}

const CO_THE_HUY: TrangThaiDon[] = ['cho_xac_nhan', 'da_xac_nhan', 'dang_giao']
const CO_THE_DOI_SERIAL: TrangThaiDon[] = ['da_xac_nhan', 'dang_giao']

function HopThoaiDoiSerial({ ma, soSerialCu, onDong, onXong }: { ma: string; soSerialCu: string; onDong: () => void; onXong: () => void }) {
  const { dangGui, loi, gui } = useGuiForm()

  function doi(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    gui(() => api.patch(`/don-hang/quan-ly/${ma}/serial`, { soSerialCu, soSerialMoi: String(form.get('soSerialMoi')), danhDauLoi: form.get('danhDauLoi') === 'on' }), onXong)
  }

  return (
    <HopThoai title={`Đổi serial ${soSerialCu}`} onClose={onDong}>
      <form onSubmit={doi} className="space-y-4">
        {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
        <TruongNhap
          name="soSerialMoi"
          label="Số serial mới"
          required
          autoFocus
          placeholder="SN-CPU5600-0001"
          hint="Dạng SN-MÃ-SỐ. Chỉ nhận chiếc cùng sản phẩm và đang còn trong kho."
        />
        <label className="flex items-center gap-2 text-[15px]">
          <input type="checkbox" name="danhDauLoi" className="size-4 accent-brand" />
          Chiếc cũ bị lỗi hoặc không còn (không trả về kho)
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Nut type="button" variant="soft" onClick={onDong}>
            Hủy
          </Nut>
          <Nut disabled={dangGui}>{dangGui ? 'Đang đổi...' : 'Đổi serial'}</Nut>
        </div>
      </form>
    </HopThoai>
  )
}

function CacSerial({ don, onDoi }: { don: DonHangChiTiet; onDoi: (soSerial: string) => void }) {
  const choPhepDoi = CO_THE_DOI_SERIAL.includes(don.trangThai)

  return (
    <section className="mt-6 rounded-xl bg-white p-5" aria-labelledby="serial">
      <h2 id="serial" className="font-bold">
        Số serial từng chiếc
      </h2>
      <p className="mt-1 text-sm text-muted">
        Serial được hệ thống chọn khi xác nhận đơn (chiếc nhập sớm nhất trước).{' '}
        {choPhepDoi ? 'Bấm Đổi nếu chiếc đó không còn hoặc lấy nhầm.' : 'Đơn đã xong nên không đổi được nữa.'}
      </p>
      <div className="mt-4 space-y-5">
        {don.cacDong.map((dong) => (
          <div key={dong.idSanPham}>
            <div className="mb-2 font-semibold">
              {dong.ten} <span className="font-normal text-muted">× {dong.soLuong}</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {dong.cacSerial.map((soSerial) => (
                <li key={soSerial} className="flex items-center gap-2 rounded-md bg-surface py-1 pr-1 pl-3 text-[15px]">
                  <span className="font-mono">{soSerial}</span>
                  {choPhepDoi && (
                    <Nut size="sm" variant="soft" onClick={() => onDoi(soSerial)}>
                      Đổi
                    </Nut>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ChiTietDonHangNhanVien() {
  const { code } = useParams()
  const goc = useGocQuanLy()
  const hienThongBao = useThongBao((s) => s.hien)
  const { duLieu: don, loi: loiTai, taiLai } = useTaiDuLieu<DonHangChiTiet>(`/don-hang/quan-ly/${code}`)
  const [dangXacNhanHuy, setDangXacNhanHuy] = useState(false)
  const [serialDangDoi, setSerialDangDoi] = useState<string | null>(null)

  if (loiTai)
    return (
      <TrangTrong>
        {loiTai}.{' '}
        <Link to={`${goc}/don-hang`} className="font-semibold text-brand">
          Quay lại danh sách
        </Link>
      </TrangTrong>
    )
  if (!don) return <TrangTrong>Đang tải...</TrangTrong>

  const buocTiep = BUOC_TIEP[don.trangThai]

  async function chuyenTrangThai(trangThai: TrangThaiDon) {
    try {
      await api.patch(`/don-hang/quan-ly/${don!.ma}/trang-thai`, { trangThai })
      taiLai()
    } catch (err) {
      hienThongBao('Không chuyển được trạng thái', layThongBaoLoi(err))
    }
  }

  return (
    <>
      <Link to={`${goc}/don-hang`} className="text-sm font-semibold text-brand hover:underline">
        ← Danh sách đơn
      </Link>
      <TieuDeTrang
        title={`Đơn ${don.ma}`}
        desc={
          don.thanhToan?.phuongThuc === 'cod' && don.trangThai === 'cho_xac_nhan' ? 'Đơn thanh toán khi nhận hàng. Gọi xác nhận với khách trước khi chuyển trạng thái.' : undefined
        }
        action={
          <div className="flex gap-2">
            {CO_THE_HUY.includes(don.trangThai) && (
              <Nut variant="danger" onClick={() => setDangXacNhanHuy(true)}>
                Hủy đơn
              </Nut>
            )}
            {buocTiep && <Nut onClick={() => chuyenTrangThai(buocTiep.trangThai)}>{buocTiep.nhan}</Nut>}
          </div>
        }
      />
      <NoiDungDonHang don={don} nhanVien />
      {don.cacDong.some((dong) => dong.cacSerial.length > 0) && <CacSerial don={don} onDoi={setSerialDangDoi} />}
      {don.trangThai === 'cho_xac_nhan' && <p className="mt-4 text-sm text-muted">Serial sẽ được gán và tồn kho sẽ giảm khi bạn xác nhận đơn.</p>}
      {don.trangThai === 'da_huy' && <Nhan tone="red">Các serial của đơn này đã được trả về kho.</Nhan>}

      {serialDangDoi && (
        <HopThoaiDoiSerial
          ma={don.ma}
          soSerialCu={serialDangDoi}
          onDong={() => setSerialDangDoi(null)}
          onXong={() => {
            setSerialDangDoi(null)
            taiLai()
          }}
        />
      )}

      {dangXacNhanHuy && (
        <HopThoai title="Hủy đơn hàng" onClose={() => setDangXacNhanHuy(false)}>
          <p>
            Bạn chắc chắn muốn hủy đơn <b>{don.ma}</b> của {don.tenNguoiNhan}?{don.trangThai !== 'cho_xac_nhan' && ' Các serial đã gán sẽ được trả về kho.'}
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Nut variant="soft" onClick={() => setDangXacNhanHuy(false)}>
              Giữ đơn
            </Nut>
            <Nut
              variant="danger"
              onClick={() => {
                setDangXacNhanHuy(false)
                chuyenTrangThai('da_huy')
              }}
            >
              Hủy đơn
            </Nut>
          </div>
        </HopThoai>
      )}
    </>
  )
}
