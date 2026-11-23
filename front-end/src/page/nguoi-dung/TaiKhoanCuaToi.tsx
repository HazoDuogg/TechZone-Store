import { useState } from 'react'
import { ThanhTab } from '../../components/GiaoDienCoBan'
import HoSoCaNhan from './HoSoCaNhan'
import SoDiaChi from './SoDiaChi'
import DoiMatKhau from './DoiMatKhau'

const CAC_TAB = ['Hồ sơ', 'Địa chỉ giao hàng', 'Đổi mật khẩu'] as const

export default function TaiKhoanCuaToi() {
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]>('Hồ sơ')
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Tài khoản của tôi</h1>
      <div className="mt-6">
        <ThanhTab value={tab} onChange={setTab} items={CAC_TAB} />
      </div>
      <div className="mt-6">
        {tab === 'Hồ sơ' && <HoSoCaNhan />}
        {tab === 'Địa chỉ giao hàng' && <SoDiaChi />}
        {tab === 'Đổi mật khẩu' && <DoiMatKhau />}
      </div>
    </div>
  )
}
