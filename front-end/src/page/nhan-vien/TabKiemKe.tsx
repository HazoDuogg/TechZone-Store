import { useState } from 'react'
import { Nhan, Nut, OChon, TrangTrong, TruongNhap } from '../../components/GiaoDienCoBan'
import PhanTrang from '../../components/PhanTrang'
import api from '../../lib/api'
import { ngayGioVN } from '../../lib/dinhDang'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import { useDebounce } from '../../hooks/useDebounce'
import { useGuiForm } from '../../hooks/useGuiForm'
import { useTaiDuLieu } from '../../hooks/useTaiDuLieu'
import { useAuthStore } from '../../auth/auth'
import type { BienBanKiemKe, DanhMucDayDu, KetQuaPhanTrang, SanPhamQuanTri } from '../../types'
import { NhanTonKho } from './SanPhamVaTonKho'

const NhanChenhLech = ({ chenhLech }: { chenhLech: number }) =>
  chenhLech === 0 ? <Nhan tone="green">Khớp</Nhan> : <Nhan tone={chenhLech < 0 ? 'red' : 'amber'}>{chenhLech > 0 ? `+${chenhLech}` : chenhLech}</Nhan>

function BangChiTietBienBan({ bienBan }: { bienBan: BienBanKiemKe }) {
  return (
    <div className={cx(tableWrap, 'mt-3 bg-white')}>
      <table className="w-full">
        <thead>
          <tr>
            <th className={th}>Sản phẩm</th>
            <th className={th}>Hệ thống</th>
            <th className={th}>Thực tế</th>
            <th className={th}>Chênh lệch</th>
          </tr>
        </thead>
        <tbody>
          {bienBan.cacDong.map((dong) => (
            <tr key={dong.idSanPham}>
              <td className={cx(td, 'min-w-48')}>{dong.ten}</td>
              <td className={cx(td, 'tabular-nums')}>{dong.tonHeThong}</td>
              <td className={cx(td, 'tabular-nums')}>{dong.tonThucTe}</td>
              <td className={td}>
                <NhanChenhLech chenhLech={dong.chenhLech} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LichSuKiemKe({ ketQua, loi, onDoiTrang }: { ketQua: KetQuaPhanTrang<BienBanKiemKe> | undefined; loi: string | undefined; onDoiTrang: (trang: number) => void }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 font-bold">Lịch sử kiểm kê</h2>
      {loi ? (
        <p className="font-semibold text-danger">{loi}</p>
      ) : !ketQua ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : ketQua.duLieu.length === 0 ? (
        <TrangTrong>Chưa có biên bản kiểm kê nào.</TrangTrong>
      ) : (
        <>
          <ul className="space-y-2">
            {ketQua.duLieu.map((bienBan) => (
              <li key={bienBan.id}>
                <details className="rounded-lg bg-white p-4">
                  <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-bold">{bienBan.ma}</span>
                    <span className="text-muted">
                      {ngayGioVN(bienBan.ngayLap)} · {bienBan.nhanVien}
                    </span>
                    <span>{bienBan.soSanPham} sản phẩm</span>
                    {bienBan.soSanPhamLech > 0 ? <Nhan tone="amber">{bienBan.soSanPhamLech} sản phẩm lệch</Nhan> : <Nhan tone="green">Khớp hoàn toàn</Nhan>}
                  </summary>
                  {bienBan.ghiChu && <p className="mt-2 text-sm text-muted">Ghi chú: {bienBan.ghiChu}</p>}
                  <BangChiTietBienBan bienBan={bienBan} />
                </details>
              </li>
            ))}
          </ul>
          <PhanTrang trang={ketQua.trang} tongTrang={ketQua.tongTrang} tong={ketQua.tong} donVi="biên bản" onDoiTrang={onDoiTrang} />
        </>
      )}
    </section>
  )
}

export default function TabKiemKe() {
  const laNhanVien = useAuthStore((s) => s.user?.vaiTro === 'nhan_vien')
  const [tuKhoa, setTuKhoa] = useState('')
  const [danhMuc, setDanhMuc] = useState('')
  const [trang, setTrang] = useState(1)
  const [trangLichSu, setTrangLichSu] = useState(1)
  const [soDem, setSoDem] = useState<Record<number, string>>({})
  const [ghiChu, setGhiChu] = useState('')
  const [bienBanVuaLap, setBienBanVuaLap] = useState<BienBanKiemKe | null>(null)
  const tuKhoaTre = useDebounce(tuKhoa.trim(), 300)
  const { dangGui, loi, datLoi, gui } = useGuiForm()

  const { duLieu: cacDanhMuc = [] } = useTaiDuLieu<DanhMucDayDu[]>('/danh-muc')
  const {
    duLieu: tonKho,
    loi: loiTon,
    taiLai: taiLaiTon,
  } = useTaiDuLieu<KetQuaPhanTrang<SanPhamQuanTri>>(laNhanVien ? '/san-pham/ton-kho' : null, {
    query: tuKhoaTre || undefined,
    danhMuc: danhMuc || undefined,
    trang,
    soLuong: 20,
  })
  const { duLieu: lichSu, loi: loiLichSu, taiLai: taiLaiLichSu } = useTaiDuLieu<KetQuaPhanTrang<BienBanKiemKe>>('/phieu-kho/kiem-ke', { trang: trangLichSu, soLuong: 5 })

  const cacSanPhamDaDem = Object.entries(soDem).filter(([, giaTri]) => giaTri !== '')

  function ghiNhan() {
    if (cacSanPhamDaDem.length === 0) {
      datLoi('Hãy nhập số đếm thực tế cho ít nhất một sản phẩm')
      return
    }
    gui(
      () =>
        api
          .post<BienBanKiemKe>('/phieu-kho/kiem-ke', { ghiChu, cacDong: cacSanPhamDaDem.map(([id, giaTri]) => ({ idSanPham: Number(id), tonThucTe: Number(giaTri) })) })
          .then((res) => setBienBanVuaLap(res.data)),
      () => {
        setSoDem({})
        setGhiChu('')
        setTrangLichSu(1)
        taiLaiLichSu()
        taiLaiTon()
      },
    )
  }

  return (
    <div>
      {bienBanVuaLap && (
        <div role="status" className="mb-6 rounded-xl bg-ok/10 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold">
              Đã lập biên bản {bienBanVuaLap.ma}: {bienBanVuaLap.soSanPham} sản phẩm,{' '}
              {bienBanVuaLap.soSanPhamLech > 0 ? `${bienBanVuaLap.soSanPhamLech} sản phẩm lệch` : 'khớp hoàn toàn'}
            </p>
            <button type="button" onClick={() => setBienBanVuaLap(null)} aria-label="Đóng thông báo" className="text-xl leading-none text-muted">
              ×
            </button>
          </div>
          {bienBanVuaLap.soSanPhamLech > 0 && (
            <ul className="mt-2 space-y-1 text-[15px]">
              {bienBanVuaLap.cacDong
                .filter((dong) => dong.chenhLech !== 0)
                .map((dong) => (
                  <li key={dong.idSanPham}>
                    {dong.ten}: hệ thống {dong.tonHeThong}, thực tế {dong.tonThucTe} <NhanChenhLech chenhLech={dong.chenhLech} />
                  </li>
                ))}
            </ul>
          )}
          <p className="mt-2 text-sm text-muted">Biên bản chỉ ghi nhận chênh lệch, không tự sửa số liệu kho. Xử lý chênh lệch bằng phiếu nhập hoặc phiếu xuất.</p>
        </div>
      )}

      {laNhanVien ? (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input
              placeholder="Tìm theo tên hoặc thương hiệu"
              aria-label="Tìm sản phẩm"
              value={tuKhoa}
              onChange={(e) => {
                setTuKhoa(e.currentTarget.value)
                setTrang(1)
              }}
              className="h-11 w-full rounded-md bg-white px-3 focus:outline-2 focus:outline-brand sm:w-72"
            />
            <OChon
              aria-label="Lọc theo danh mục"
              value={danhMuc}
              onChange={(e) => {
                setDanhMuc(e.currentTarget.value)
                setTrang(1)
              }}
              className="w-48 [&_select]:bg-white"
            >
              <option value="">Mọi danh mục</option>
              {cacDanhMuc.map((dm) => (
                <option key={dm.id} value={dm.id}>
                  {dm.ten}
                </option>
              ))}
            </OChon>
            <p className="text-muted">Nhập số đếm thực tế cho những sản phẩm bạn đã kiểm, bỏ trống sản phẩm chưa kiểm. Số đã nhập được giữ khi chuyển trang.</p>
          </div>

          {loiTon ? (
            <p className="font-semibold text-danger">{loiTon}</p>
          ) : !tonKho ? (
            <TrangTrong>Đang tải...</TrangTrong>
          ) : tonKho.duLieu.length === 0 ? (
            <TrangTrong>Không có sản phẩm nào.</TrangTrong>
          ) : (
            <>
              <div className={cx(tableWrap, 'bg-white')}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={th}>Sản phẩm</th>
                      <th className={th}>Tồn hệ thống</th>
                      <th className={th}>Thực tế</th>
                      <th className={th}>Chênh lệch</th>
                      <th className={th}>Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tonKho.duLieu.map((sp) => {
                      const dem = soDem[sp.id] ?? ''
                      return (
                        <tr key={sp.id}>
                          <td className={cx(td, 'min-w-64 font-medium')}>{sp.ten}</td>
                          <td className={cx(td, 'tabular-nums')}>{sp.tonKho}</td>
                          <td className={td}>
                            <input
                              type="number"
                              min={0}
                              max={100000}
                              value={dem}
                              onChange={(e) => {
                                const giaTri = e.currentTarget.value
                                setSoDem((truoc) => ({ ...truoc, [sp.id]: giaTri }))
                              }}
                              aria-label={`Số lượng thực tế của ${sp.ten}`}
                              className="h-9 w-24 rounded-md bg-surface px-2 focus:bg-white focus:outline-2 focus:outline-brand"
                            />
                          </td>
                          <td className={td}>{dem === '' ? '—' : <NhanChenhLech chenhLech={Number(dem) - sp.tonKho} />}</td>
                          <td className={td}>
                            <NhanTonKho n={sp.tonKho} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <PhanTrang trang={tonKho.trang} tongTrang={tonKho.tongTrang} tong={tonKho.tong} donVi="sản phẩm" onDoiTrang={setTrang} />
            </>
          )}

          <div className="mt-6 space-y-3 rounded-xl bg-white p-5">
            {loi && <p className="text-sm font-semibold text-danger">{loi}</p>}
            <TruongNhap label="Ghi chú biên bản" value={ghiChu} onChange={(e) => setGhiChu(e.currentTarget.value)} placeholder="Ví dụ: Kiểm kê khu vực CPU cuối tháng" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-muted">Đã nhập số đếm cho {cacSanPhamDaDem.length} sản phẩm</span>
              <Nut onClick={ghiNhan} disabled={dangGui}>
                {dangGui ? 'Đang ghi nhận...' : 'Ghi nhận kiểm kê'}
              </Nut>
            </div>
          </div>
        </>
      ) : (
        <p className="rounded-xl bg-white p-5 text-muted">Chỉ nhân viên kho mới lập được biên bản kiểm kê. Quản trị viên xem lịch sử ở bên dưới.</p>
      )}

      <LichSuKiemKe ketQua={lichSu} loi={loiLichSu} onDoiTrang={setTrangLichSu} />
    </div>
  )
}
