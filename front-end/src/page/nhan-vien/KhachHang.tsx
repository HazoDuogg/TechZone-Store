import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TieuDeTrang } from '../../components/BoCuc'
import { HopThoai, Nhan, NhanTrangThai, Nut, TrangTrong, VungNhap } from '../../components/GiaoDienCoBan'
import PhanTrang from '../../components/PhanTrang'
import api from '../../lib/api'
import { ngayGioVN, ngayVN, tienVND } from '../../lib/dinhDang'
import { useGocQuanLy } from '../../lib/gocQuanLy'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { useDebounce } from '../../hooks/useDebounce'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { NHAN_TRANG_THAI_DON } from '../../constants'
import type { KetQuaPhanTrang, KhachHangChiTiet, KhachHangTomTat } from '../../types'

function ChiTietKhachHang({ id, onDong }: { id: number; onDong: () => void }) {
  const goc = useGocQuanLy()
  const { duLieu: khach, loi: loiTai, taiLai } = useTaiDuLieu<KhachHangChiTiet>(`/khach-hang/${id}`)
  const [daLuu, setDaLuu] = useState(false)
  const { dangGui, loi, gui } = useGuiForm()

  function luuGhiChu(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const ghiChu = String(new FormData(e.currentTarget).get('ghiChu'))
    setDaLuu(false)
    gui(
      () => api.patch(`/khach-hang/${id}`, { ghiChu }),
      () => {
        setDaLuu(true)
        taiLai()
      },
    )
  }

  return (
    <HopThoai title={khach ? khach.hoTen : 'Khách hàng'} onClose={onDong} wide>
      {loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : !khach ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : (
        <div className="space-y-6">
          <dl className="grid gap-x-8 gap-y-1 text-[15px] sm:grid-cols-2">
            <div>
              <dt className="inline text-muted">Email: </dt>
              <dd className="inline font-medium">{khach.email}</dd>
            </div>
            <div>
              <dt className="inline text-muted">Điện thoại: </dt>
              <dd className="inline font-medium">{khach.soDienThoai}</dd>
            </div>
            <div>
              <dt className="inline text-muted">Thành viên từ: </dt>
              <dd className="inline font-medium">{ngayGioVN(khach.ngayTao)}</dd>
            </div>
            <div>
              <dt className="inline text-muted">Tài khoản: </dt>
              <dd className="inline">{khach.trangThaiTaiKhoan === 'hoat_dong' ? <Nhan tone="green">Hoạt động</Nhan> : <Nhan tone="red">Đã khóa</Nhan>}</dd>
            </div>
          </dl>

          <section>
            <h3 className="mb-2 font-bold">Địa chỉ đã lưu</h3>
            {khach.cacDiaChi.length === 0 ? (
              <p className="text-muted">Chưa lưu địa chỉ nào.</p>
            ) : (
              <ul className="space-y-1.5 text-[15px]">
                {khach.cacDiaChi.map((dc) => (
                  <li key={dc.id}>
                    {dc.tenNguoiNhan} · {dc.soDienThoai} · {dc.diaChi} {dc.macDinh && <Nhan tone="green">Mặc định</Nhan>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="mb-2 font-bold">Đơn hàng gần đây</h3>
            {khach.cacDon.length === 0 ? (
              <p className="text-muted">Chưa có đơn hàng nào.</p>
            ) : (
              <ul className="divide-y divide-surface-2 text-[15px]">
                {khach.cacDon.map((don) => (
                  <li key={don.ma} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <Link to={`${goc}/don-hang/${don.ma}`} className="font-bold text-brand hover:underline">
                      {don.ma}
                    </Link>
                    <span className="text-muted">{ngayVN(don.ngayDat)}</span>
                    <NhanTrangThai status={NHAN_TRANG_THAI_DON[don.trangThai]} />
                    <span className="font-semibold">{tienVND(don.tongTien)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <form onSubmit={luuGhiChu} className="space-y-3">
            {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
            {daLuu && (
              <p role="status" className="text-sm font-semibold text-ok">
                Đã lưu ghi chú.
              </p>
            )}
            <VungNhap name="ghiChu" label="Ghi chú chăm sóc khách" defaultValue={khach.ghiChu ?? ''} maxLength={255} placeholder="Ví dụ: Khách quen, thích giao buổi sáng" />
            <div className="flex justify-end">
              <Nut disabled={dangGui}>{dangGui ? 'Đang lưu...' : 'Lưu ghi chú'}</Nut>
            </div>
          </form>
        </div>
      )}
    </HopThoai>
  )
}

export default function KhachHang() {
  const [tuKhoa, setTuKhoa] = useState('')
  const [trang, setTrang] = useState(1)
  const [idDangXem, setIdDangXem] = useState<number | null>(null)
  const tuKhoaTre = useDebounce(tuKhoa.trim(), 300)

  const { duLieu: ketQua, loi: loiTai } = useTaiDuLieu<KetQuaPhanTrang<KhachHangTomTat>>('/khach-hang', { query: tuKhoaTre || undefined, trang, soLuong: 20 })

  return (
    <>
      <TieuDeTrang title="Thông tin khách hàng" desc="Xem khách đã đăng ký, lịch sử mua hàng và lưu ghi chú chăm sóc." />
      <input
        placeholder="Tìm theo tên, số điện thoại, email"
        aria-label="Tìm khách hàng"
        value={tuKhoa}
        onChange={(e) => {
          setTuKhoa(e.currentTarget.value)
          setTrang(1)
        }}
        className="mb-4 h-11 w-full rounded-md bg-white px-3 text-[15px] focus:outline-2 focus:outline-brand sm:max-w-md"
      />

      {loiTai ? (
        <p className="font-semibold text-danger">{loiTai}</p>
      ) : !ketQua ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : ketQua.duLieu.length === 0 ? (
        <TrangTrong>Không có khách hàng nào.</TrangTrong>
      ) : (
        <>
          <div className={cx(tableWrap, 'bg-white')}>
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>Khách hàng</th>
                  <th className={th}>Liên hệ</th>
                  <th className={th}>Số đơn</th>
                  <th className={th}>Đã chi tiêu</th>
                  <th className={th}>Đơn gần nhất</th>
                  <th className={th}>
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ketQua.duLieu.map((kh) => (
                  <tr key={kh.id}>
                    <td className={td}>
                      <div className="font-semibold">{kh.hoTen}</div>
                      {kh.trangThaiTaiKhoan === 'khoa' && <Nhan tone="red">Đã khóa</Nhan>}
                    </td>
                    <td className={td}>
                      {kh.soDienThoai}
                      <div className="text-sm text-muted">{kh.email}</div>
                    </td>
                    <td className={cx(td, 'tabular-nums')}>{kh.soDon}</td>
                    <td className={cx(td, 'font-semibold whitespace-nowrap tabular-nums')}>{tienVND(kh.tongChiTieu)}</td>
                    <td className={cx(td, 'whitespace-nowrap text-muted')}>{kh.donGanNhat ? ngayVN(kh.donGanNhat) : '—'}</td>
                    <td className={td}>
                      <Nut size="sm" variant="soft" onClick={() => setIdDangXem(kh.id)}>
                        Xem
                      </Nut>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PhanTrang trang={ketQua.trang} tongTrang={ketQua.tongTrang} tong={ketQua.tong} donVi="khách hàng" onDoiTrang={setTrang} />
        </>
      )}

      {idDangXem !== null && <ChiTietKhachHang id={idDangXem} onDong={() => setIdDangXem(null)} />}
    </>
  )
}
