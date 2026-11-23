import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { ThanhTab } from '../../components/GiaoDienCoBan'
import TabNhapKho from './TabNhapKho'
import TabXuatKho from './TabXuatKho'
import TabKiemKe from './TabKiemKe'

const CAC_TAB = ['Nhập kho', 'Xuất kho', 'Kiểm kê'] as const

export default function QuanLyKho() {
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>('Nhập kho')
  return (
    <>
      <TieuDeTrang title="Quản lý kho" desc="Nhập hàng, xuất hàng và kiểm kê tồn kho trên cùng một màn hình." />
      <div className="mb-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>
      {tab === 'Nhập kho' && <TabNhapKho />}
      {tab === 'Xuất kho' && <TabXuatKho />}
      {tab === 'Kiểm kê' && <TabKiemKe />}
    </>
  )
}
