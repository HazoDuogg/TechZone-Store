import { useState } from 'react'
import { TieuDeTrang } from '../../components/BoCuc'
import { ThanhTab } from '../../components/GiaoDienCoBan'
import TabSanPham from './TabSanPham'
import TabDanhMuc from './TabDanhMuc'

const CAC_TAB = ['Sản phẩm', 'Danh mục'] as const

export default function QuanLySanPham() {
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>('Sản phẩm')
  return (
    <>
      <TieuDeTrang title="Quản lý sản phẩm" desc="Thêm, sửa, ngừng bán sản phẩm và quản lý danh mục." />
      <div className="mb-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>
      {tab === 'Sản phẩm' ? <TabSanPham /> : <TabDanhMuc />}
    </>
  )
}
