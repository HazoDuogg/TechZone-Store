import type { KetQuaPhieuKho as KetQuaPhieu } from '../../types'

export default function KetQuaPhieuKho({ phieu, loai, onDong }: { phieu: KetQuaPhieu; loai: 'nhập' | 'xuất'; onDong: () => void }) {
  return (
    <div role="status" className="rounded-xl bg-ok/10 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold">
          Đã lập phiếu {loai} {phieu.ma}
        </p>
        <button type="button" onClick={onDong} aria-label="Đóng thông báo" className="text-xl leading-none text-muted">
          ×
        </button>
      </div>
      <ul className="mt-2 space-y-1.5 text-[15px]">
        {phieu.cacDong.map((dong) => (
          <li key={dong.idSanPham}>
            <span className="font-semibold">{dong.ten}</span> × {dong.soLuong}
            <div className="text-sm text-muted">
              {dong.cacSerial.length > 2 ? `${dong.cacSerial[0]} … ${dong.cacSerial[dong.cacSerial.length - 1]}` : dong.cacSerial.join(', ')}
              {dong.sanPhamMoi && ' · Sản phẩm mới, đang chờ bổ sung. Báo quản trị viên đặt giá và mở bán.'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
