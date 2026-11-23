import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NhuCauBuildPc } from './dto/de-xuat-build-pc.dto';

type LinhKien = {
  id: number
  ten: string
  thuongHieu: string | null
  gia: number
  giaNiemYet: number | null
  danhMuc: string
  tonKho: number
  anh: string | null
  thongSo: Record<string, string>
}

type CauHinh = Record<string, LinhKien | null>

const DM = { CPU: 'CPU', MAINBOARD: 'Mainboard', RAM: 'RAM', VGA: 'VGA', SSD: 'SSD', NGUON: 'Nguồn', CASE: 'Case' } as const

const TRONG_SO: Record<NhuCauBuildPc, Partial<Record<keyof typeof DM, number>>> = {
  [NhuCauBuildPc.CHOI_GAME]: { VGA: 0.35, CPU: 0.2, MAINBOARD: 0.1, RAM: 0.08, SSD: 0.07, NGUON: 0.08, CASE: 0.05 },
  [NhuCauBuildPc.DO_HOA]: { CPU: 0.27, VGA: 0.25, RAM: 0.13, SSD: 0.1, MAINBOARD: 0.1, NGUON: 0.07, CASE: 0.05 },
  [NhuCauBuildPc.VAN_PHONG]: { CPU: 0.3, MAINBOARD: 0.15, RAM: 0.12, SSD: 0.15, NGUON: 0.1, CASE: 0.08 },
}

const SO_UNG_VIEN_TOI_DA = 12

const laySo = (giaTri: string | undefined) => Number((giaTri ?? '').replace(/[^0-9]/g, '')) || 0

const chonDaiDien = (ds: LinhKien[]) => {
  if (ds.length <= SO_UNG_VIEN_TOI_DA) return ds
  const theoGia = [...ds].sort((a, b) => a.gia - b.gia)
  return Array.from({ length: SO_UNG_VIEN_TOI_DA }, (_, i) => theoGia[Math.round((i * (theoGia.length - 1)) / (SO_UNG_VIEN_TOI_DA - 1))])
}

@Injectable()
export class BuildPcService {
  constructor(private readonly dataSource: DataSource) { }

  async deXuat(nganSach: number, nhuCau: NhuCauBuildPc) {
    const cacLinhKien = await this.layLinhKienConHang()
    const theoNhom = (ten: string) => chonDaiDien(cacLinhKien.filter((lk) => lk.danhMuc === ten))
    const canVga = nhuCau !== NhuCauBuildPc.VAN_PHONG
    const trongSo = TRONG_SO[nhuCau]

    const cacCpu = theoNhom(DM.CPU).filter((cpu) => canVga || cpu.thongSo['Đồ họa tích hợp'] === 'Có')
    const cacVga: (LinhKien | null)[] = canVga ? theoNhom(DM.VGA) : [null]
    let tot: { cauHinh: CauHinh; tong: number; diem: number } | null = null
    let reNhat: number | null = null

    for (const cpu of cacCpu) {
      for (const mainboard of theoNhom(DM.MAINBOARD).filter((mb) => mb.thongSo['Socket'] === cpu.thongSo['Socket'])) {
        for (const ram of theoNhom(DM.RAM).filter((r) => r.thongSo['Loại RAM'] === mainboard.thongSo['Loại RAM'])) {
          for (const vga of cacVga) {
            const congSuatCan = vga ? laySo(vga.thongSo['Nguồn đề nghị']) : 0
            for (const nguon of theoNhom(DM.NGUON).filter((n) => laySo(n.thongSo['Công suất']) >= congSuatCan)) {
              for (const ssd of theoNhom(DM.SSD)) {
                for (const vo of theoNhom(DM.CASE)) {
                  const cauHinh: CauHinh = { CPU: cpu, MAINBOARD: mainboard, RAM: ram, VGA: vga, SSD: ssd, NGUON: nguon, CASE: vo }
                  const tong = Object.values(cauHinh).reduce((t, lk) => t + (lk?.gia ?? 0), 0)
                  reNhat = reNhat === null ? tong : Math.min(reNhat, tong)
                  if (tong > nganSach) continue

                  const diem = Object.entries(cauHinh).reduce((t, [nhom, lk]) => t + (lk ? (trongSo[nhom as keyof typeof DM] ?? 0) * Math.log(lk.gia) : 0), 0)
                  if (!tot || diem > tot.diem || (diem === tot.diem && tong < tot.tong)) tot = { cauHinh, tong, diem }
                }
              }
            }
          }
        }
      }
    }

    if (!tot) {
      throw new BadRequestException(
        reNhat === null
          ? 'Hiện chưa đủ linh kiện còn hàng để ghép một bộ máy hoàn chỉnh'
          : `Ngân sách quá thấp. Bộ máy rẻ nhất hiện có cho nhu cầu này khoảng ${reNhat.toLocaleString('vi-VN')}đ`,
      )
    }

    return {
      nganSach,
      nhuCau,
      tongTien: tot.tong,
      conLai: nganSach - tot.tong,
      cacMuc: Object.values(tot.cauHinh).filter((lk): lk is LinhKien => lk !== null).map((lk) => ({ id: lk.id, ten: lk.ten, thuongHieu: lk.thuongHieu, gia: lk.gia, giaNiemYet: lk.giaNiemYet, danhMuc: lk.danhMuc, tonKho: lk.tonKho, anh: lk.anh })),
    }
  }

  private async layLinhKienConHang() {
    const dong = await this.dataSource.query<(Omit<LinhKien, 'thongSo' | 'gia' | 'giaNiemYet' | 'tonKho'> & { gia: string; giaNiemYet: string | null; tonKho: string; thongSo: string | Record<string, string> | null })[]>(
      `SELECT sp.id, sp.ten, sp.thuong_hieu AS thuongHieu, sp.gia, sp.gia_niem_yet AS giaNiemYet, sp.thong_so AS thongSo, dm.ten AS danhMuc,
              (SELECT COUNT(*) FROM chi_tiet_san_pham c WHERE c.id_san_pham = sp.id AND c.trang_thai = 'trong_kho') AS tonKho,
              (SELECT a.duong_dan FROM anh_san_pham a WHERE a.id_san_pham = sp.id ORDER BY a.anh_chinh DESC, a.thu_tu ASC LIMIT 1) AS anh
       FROM san_pham sp
       JOIN danh_muc dm ON dm.id = sp.id_danh_muc
       WHERE sp.trang_thai = 'dang_ban' AND sp.gia > 0
       HAVING tonKho > 0`,
    )
    return dong.map((d) => ({
      ...d,
      gia: Number(d.gia),
      giaNiemYet: d.giaNiemYet === null ? null : Number(d.giaNiemYet),
      tonKho: Number(d.tonKho),
      thongSo: typeof d.thongSo === 'string' ? (JSON.parse(d.thongSo) as Record<string, string>) : (d.thongSo ?? {}),
    }))
  }
}
