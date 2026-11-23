import { Nut } from './GiaoDienCoBan'

type Props = {
  trang: number
  tongTrang: number
  tong: number
  donVi: string
  onDoiTrang: (trang: number) => void
}

export default function PhanTrang({ trang, tongTrang, tong, donVi, onDoiTrang }: Props) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[15px]">
      <span className="text-muted">
        <span className="font-semibold text-ink">{tong}</span> {donVi}
      </span>
      {tongTrang > 1 && (
        <span className="flex items-center gap-2">
          <Nut size="sm" variant="soft" disabled={trang <= 1} onClick={() => onDoiTrang(trang - 1)}>
            Trang trước
          </Nut>
          <span>
            Trang {trang}/{tongTrang}
          </span>
          <Nut size="sm" variant="soft" disabled={trang >= tongTrang} onClick={() => onDoiTrang(trang + 1)}>
            Trang sau
          </Nut>
        </span>
      )}
    </div>
  )
}
