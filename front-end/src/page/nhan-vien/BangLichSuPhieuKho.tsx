import { TrangTrong } from '../../components/GiaoDienCoBan'
import PhanTrang from '../../components/PhanTrang'
import { ngayGioVN } from '../../lib/dinhDang'
import { cx, tableWrap, td, th } from '../../lib/lopCss'
import type { KetQuaPhanTrang, PhieuKho } from '../../types'

type Props = {
  loai: 'nhap' | 'xuat'
  ketQua: KetQuaPhanTrang<PhieuKho> | undefined
  loi: string | undefined
  onDoiTrang: (trang: number) => void
}

export default function BangLichSuPhieuKho({ loai, ketQua, loi, onDoiTrang }: Props) {
  const tenLoai = loai === 'nhap' ? 'nhập' : 'xuất'

  return (
    <div>
      <h2 className="mb-3 font-bold">Lịch sử {tenLoai} kho</h2>
      {loi ? (
        <p className="font-semibold text-danger">{loi}</p>
      ) : !ketQua ? (
        <TrangTrong>Đang tải...</TrangTrong>
      ) : ketQua.duLieu.length === 0 ? (
        <TrangTrong>Chưa có phiếu {tenLoai} nào.</TrangTrong>
      ) : (
        <>
          <div className={cx(tableWrap, 'bg-white')}>
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>Thời gian</th>
                  <th className={th}>Phiếu</th>
                  <th className={th}>Sản phẩm</th>
                  <th className={th}>SL</th>
                  <th className={th}>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {ketQua.duLieu.map((phieu) => (
                  <tr key={phieu.id}>
                    <td className={cx(td, 'whitespace-nowrap')}>{ngayGioVN(phieu.ngayLap)}</td>
                    <td className={td}>
                      <div className="font-bold">{phieu.ma}</div>
                      <div className="text-sm text-muted">{phieu.nhanVien}</div>
                    </td>
                    <td className={td}>
                      {phieu.cacDong.map((dong) => (
                        <div key={dong.idSanPham}>
                          {dong.ten} <span className="text-muted">× {dong.soLuong}</span>
                        </div>
                      ))}
                    </td>
                    <td className={cx(td, 'font-bold tabular-nums')}>
                      {loai === 'nhap' ? '+' : '−'}
                      {phieu.tongSoLuong}
                    </td>
                    <td className={cx(td, 'text-muted')}>{phieu.ghiChu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PhanTrang trang={ketQua.trang} tongTrang={ketQua.tongTrang} tong={ketQua.tong} donVi="phiếu" onDoiTrang={onDoiTrang} />
        </>
      )}
    </div>
  )
}
