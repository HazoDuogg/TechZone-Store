import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

const TONG_TIEN_DON = `
  SELECT dh.id, dh.trang_thai, dh.ngay_dat, dh.ngay_hoan_tat,
         COALESCE(SUM(ct.so_luong * ct.don_gia), 0) - dh.tien_giam + dh.phi_van_chuyen AS tong
  FROM don_hang dh
  LEFT JOIN chi_tiet_don_hang ct ON ct.id_don_hang = dh.id
  GROUP BY dh.id
`

const dinhDangThang = (nam: number, thang: number) => `${nam}-${String(thang).padStart(2, '0')}`

@Injectable()
export class BaoCaoService {
  constructor(private readonly dataSource: DataSource) { }

  async tongQuan(soThang: number) {
    const hienTai = new Date()
    const dauKy = new Date(hienTai.getFullYear(), hienTai.getMonth() - (soThang - 1), 1)

    const [doanhThuThang, trangThaiDon, banChay, canNhapThem, [tonKho], [khachMoi], baoHanh] = await Promise.all([
      this.dataSource.query<{ thang: string; doanhThu: string; soDon: string }[]>(
        `SELECT DATE_FORMAT(t.ngay_hoan_tat, '%Y-%m') AS thang, SUM(t.tong) AS doanhThu, COUNT(*) AS soDon
         FROM (${TONG_TIEN_DON}) t
         WHERE t.trang_thai = 'hoan_tat' AND t.ngay_hoan_tat >= ?
         GROUP BY thang`,
        [dauKy],
      ),
      this.dataSource.query<{ trangThai: string; soDon: string }[]>(
        `SELECT trang_thai AS trangThai, COUNT(*) AS soDon FROM don_hang WHERE ngay_dat >= ? GROUP BY trang_thai`,
        [dauKy],
      ),
      this.dataSource.query<{ idSanPham: number; ten: string; soLuong: string; doanhThu: string }[]>(
        `SELECT sp.id AS idSanPham, sp.ten, SUM(ct.so_luong) AS soLuong, SUM(ct.so_luong * ct.don_gia) AS doanhThu
         FROM chi_tiet_don_hang ct
         JOIN don_hang dh ON dh.id = ct.id_don_hang AND dh.trang_thai = 'hoan_tat' AND dh.ngay_hoan_tat >= ?
         JOIN san_pham sp ON sp.id = ct.id_san_pham
         GROUP BY sp.id, sp.ten
         ORDER BY soLuong DESC, doanhThu DESC
         LIMIT 5`,
        [dauKy],
      ),
      this.dataSource.query<{ idSanPham: number; ten: string; tonKho: string }[]>(
        `SELECT sp.id AS idSanPham, sp.ten, COUNT(c.id) AS tonKho
         FROM san_pham sp
         LEFT JOIN chi_tiet_san_pham c ON c.id_san_pham = sp.id AND c.trang_thai = 'trong_kho'
         WHERE sp.trang_thai = 'dang_ban'
         GROUP BY sp.id, sp.ten
         HAVING tonKho < 5
         ORDER BY tonKho ASC, sp.ten ASC
         LIMIT 8`,
      ),
      this.dataSource.query<{ giaTri: string; soSanPham: string }[]>(
        `SELECT COALESCE(SUM(sp.gia * x.n), 0) AS giaTri, COALESCE(SUM(x.n), 0) AS soSanPham
         FROM san_pham sp
         JOIN (SELECT id_san_pham, COUNT(*) AS n FROM chi_tiet_san_pham WHERE trang_thai = 'trong_kho' GROUP BY id_san_pham) x ON x.id_san_pham = sp.id`,
      ),
      this.dataSource.query<{ soKhach: string }[]>(`SELECT COUNT(*) AS soKhach FROM khach_hang WHERE ngay_tao >= ?`, [dauKy]),
      this.dataSource.query<{ trangThai: string; soPhieu: string }[]>(`SELECT trang_thai AS trangThai, COUNT(*) AS soPhieu FROM bao_hanh GROUP BY trang_thai`),
    ])

    const theoThang = new Map(doanhThuThang.map((d) => [d.thang, d]))
    const cacThang = Array.from({ length: soThang }, (_, i) => {
      const ngay = new Date(dauKy.getFullYear(), dauKy.getMonth() + i, 1)
      const khoa = dinhDangThang(ngay.getFullYear(), ngay.getMonth() + 1)
      const dong = theoThang.get(khoa)
      return { thang: khoa, doanhThu: Number(dong?.doanhThu ?? 0), soDon: Number(dong?.soDon ?? 0) }
    })

    const soDonTheo = Object.fromEntries(trangThaiDon.map((d) => [d.trangThai, Number(d.soDon)]))
    const doanhThu = cacThang.reduce((tong, t) => tong + t.doanhThu, 0)
    const soDonHoanTat = cacThang.reduce((tong, t) => tong + t.soDon, 0)

    return {
      soThang,
      tuNgay: dauKy,
      tong: {
        doanhThu,
        soDonHoanTat,
        giaTriTrungBinh: soDonHoanTat ? Math.round(doanhThu / soDonHoanTat) : 0,
        soDonDaHuy: soDonTheo['da_huy'] ?? 0,
        soDonDangXuLy: (soDonTheo['cho_xac_nhan'] ?? 0) + (soDonTheo['da_xac_nhan'] ?? 0) + (soDonTheo['dang_giao'] ?? 0),
        khachHangMoi: Number(khachMoi.soKhach),
        giaTriTonKho: Number(tonKho.giaTri),
        soSanPhamTonKho: Number(tonKho.soSanPham),
      },
      doanhThuTheoThang: cacThang,
      banChay: banChay.map((d) => ({ ...d, soLuong: Number(d.soLuong), doanhThu: Number(d.doanhThu) })),
      canNhapThem: canNhapThem.map((d) => ({ ...d, tonKho: Number(d.tonKho) })),
      baoHanh: Object.fromEntries(baoHanh.map((d) => [d.trangThai, Number(d.soPhieu)])),
    }
  }
}
