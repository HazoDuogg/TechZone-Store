import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cx } from '../lib/lopCss'
import { anhTheoDuongDan } from '../lib/duongDanAnh'
import { tienVND } from '../lib/dinhDang'
import { useBamRaNgoai } from '../hooks/useBamRaNgoai'
import { useDebounce } from '../hooks/useDebounce'
import { useTaiDuLieu } from '../hooks/useTaiDuLieu'

type GoiY = {
  id: number
  ten: string
  gia: number
  anh: string | null
}

export default function TimKiem() {
  const chuyenTrang = useNavigate()
  const [tuKhoa, setTuKhoa] = useState('')
  const [dangMo, setDangMo] = useState(false)
  const [viTriChon, setViTriChon] = useState(-1)
  const khung = useRef<HTMLDivElement>(null)

  const tuKhoaSach = tuKhoa.trim()
  const tuKhoaTre = useDebounce(tuKhoaSach, 300)
  const { duLieu: dsGoiY = [], dangTai } = useTaiDuLieu<GoiY[]>(tuKhoaTre.length >= 2 ? '/san-pham/goi-y' : null, { query: tuKhoaTre })
  const hienKhung = dangMo && tuKhoaSach.length >= 2 && (dangTai || dsGoiY.length > 0)
  const hienGoiY = hienKhung && !dangTai && dsGoiY.length > 0

  useBamRaNgoai(khung, dangMo, () => setDangMo(false))

  function timKiem() {
    if (!tuKhoaSach) {
      return
    }
    setDangMo(false)
    chuyenTrang('/san-pham?query=' + encodeURIComponent(tuKhoaSach))
  }

  function chonSanPham(id: number) {
    setDangMo(false)
    chuyenTrang('/san-pham/' + id)
  }

  function khiNhanPhim(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' && hienGoiY) {
      e.preventDefault()
      setViTriChon((v: number) => (v + 1) % dsGoiY.length)
    } else if (e.key === 'ArrowUp' && hienGoiY) {
      e.preventDefault()
      setViTriChon((v: number) => (v <= 0 ? dsGoiY.length - 1 : v - 1))
    } else if (e.key === 'Enter' && hienGoiY && viTriChon >= 0) {
      e.preventDefault()
      chonSanPham(dsGoiY[viTriChon].id)
    }
  }

  function resetTimKiem() {
    setDangMo(false)
    setTuKhoa('')
  }

  return (
    <div ref={khung} className="relative hidden flex-1 md:block">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          timKiem()
          resetTimKiem()
        }}
      >
        <input
          aria-label="Tìm kiếm sản phẩm"
          placeholder="Tìm CPU, VGA, RAM, màn hình…"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.currentTarget.value)
            setViTriChon(-1)
            setDangMo(true)
          }}
          onFocus={() => setDangMo(true)}
          onKeyDown={khiNhanPhim}
          autoComplete="off"
          className="h-11 w-full max-w-xl rounded-md bg-surface px-4 text-[15px] focus:bg-white focus:outline-2 focus:outline-brand"
        />
      </form>
      {hienKhung && (
        <ul role="listbox" className="absolute top-full left-0 z-40 mt-2 w-full max-w-xl overflow-hidden rounded-lg bg-white p-1.5 shadow-lg ring-1 ring-black/10">
          {dangTai ? (
            <li className="px-3 py-3 text-sm text-muted">Đang tìm kiếm...</li>
          ) : (
            <>
              {dsGoiY.map((sp, i) => (
                <li key={sp.id} role="option" aria-selected={i === viTriChon}>
                  <button
                    type="button"
                    onClick={() => chonSanPham(sp.id)}
                    onMouseEnter={() => setViTriChon(i)}
                    className={cx('flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors', i === viTriChon ? 'bg-surface' : '')}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-white">
                      {sp.anh && <img src={anhTheoDuongDan(sp.anh)} alt="" className="h-full w-full object-contain" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{sp.ten}</span>
                      <span className="block text-sm font-semibold text-brand">{tienVND(sp.gia)}</span>
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={timKiem} className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-brand hover:bg-surface">
                  Xem tất cả kết quả cho “{tuKhoaSach}”
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  )
}
