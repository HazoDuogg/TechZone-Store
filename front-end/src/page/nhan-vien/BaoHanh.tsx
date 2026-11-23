import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import TraCuuBaoHanh from './TraCuuBaoHanh'
import DanhSachBaoHanh from './DanhSachBaoHanh'

export default function BaoHanh() {
  const [maPhieuMoi, setMaPhieuMoi] = useState<string | null>(null)
  const [lanLamMoi, setLanLamMoi] = useState(0)

  return (
    <>
      <TieuDeTrang title="Bảo hành" desc="Tra cứu theo serial hoặc mã đơn hàng, tiếp nhận ngay từ kết quả tra cứu và cập nhật kết quả sửa chữa." />
      {maPhieuMoi && (
        <p role="status" className="mb-4 rounded-lg bg-ok/10 px-4 py-3 font-semibold">
          Đã tiếp nhận, mã phiếu {maPhieuMoi}.
        </p>
      )}
      <TraCuuBaoHanh
        onTiepNhanXong={(ma) => {
          setMaPhieuMoi(ma)
          setLanLamMoi((n) => n + 1)
        }}
      />
      <DanhSachBaoHanh key={lanLamMoi} />
    </>
  )
}
