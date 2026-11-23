import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DonHang } from './entities/don-hang.entities';
import { DataSource, In } from 'typeorm';
import { MaGiamGiaService } from '../ma-giam-gia/ma-giam-gia.service';
import { SanPham } from '../san-pham/entities/san-pham.entities';
import { ChiTietSanPham } from '../san-pham/entities/chi-tiet-san-pham.entities';
import { KhachHang } from '../khach-hang/entities/khach-hang.entities';
import { randomBytes } from 'crypto';
import { ChiTietDonHang } from './entities/chi-tiet-don-hang.entities';
import { ThanhToan } from './entities/thanh-toan.entities';
import { DatHangDTO, TamTinhDTO } from './dto/tao-don-hang.dto';
import { LocDonCuaToiDTO } from './dto/loc-don-cua-toi.dto';
import { HuyDonDTO, TraCuuDonDTO } from './dto/tra-cuu-don.dto';
import { DonHangQuanLyService } from './don-hang-quan-ly.service';
import { TrangThaiDonHang } from '../../common/enums/trang-thai-don-hang.enum';
import { VaiTro } from '../../common/enums/vai-tro.enum';
import type { NguoiDungHienTai } from '../../common/guards/jwt-auth.guard';

const PHI_VAN_CHUYEN = 30_000
const MIEN_PHI_TU = 5_000_000

@Injectable()
export class DonHangService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly maGiamGiaService: MaGiamGiaService,
    private readonly donHangQuanLyService: DonHangQuanLyService,
  ) { }

  async datHang(dto: DatHangDTO, idTaiKhoan?: number) {
    const soLuongTheoSp = this.gopSoLuong(dto.cacDong)
    const ids = [...soLuongTheoSp.keys()]

    return this.dataSource.transaction(async (manager) => {
      const dsSanPham = await manager.find(SanPham, { where: { id: In(ids), trangThai: 'dang_ban' } })
      if (dsSanPham.length !== ids.length) {
        throw new BadRequestException('Có sản phẩm không tồn tại hoặc đã ngừng bán')
      }

      const dongTon = await manager.createQueryBuilder(ChiTietSanPham, 'c')
        .select('c.id_san_pham', 'idSanPham')
        .addSelect('COUNT(*)', 'soLuong')
        .where('c.id_san_pham IN (:...ids)', { ids })
        .andWhere("c.trang_thai = 'trong_kho'")
        .groupBy('c.id_san_pham')
        .getRawMany<{ idSanPham: number; soLuong: string }>()
      const tonTheoSp = new Map(dongTon.map((d) => [d.idSanPham, Number(d.soLuong)]))

      for (const sp of dsSanPham) {
        const ton = tonTheoSp.get(sp.id) ?? 0
        if (ton < soLuongTheoSp.get(sp.id)!) {
          throw new ConflictException(`"${sp.ten}" chỉ còn ${ton} sản phẩm trong kho`)
        }
      }

      const tamTinh = dsSanPham.reduce((tong, sp) => tong + sp.gia * soLuongTheoSp.get(sp.id)!, 0)
      const giam = dto.maGiamGia ? await this.maGiamGiaService.tinhGiam(dto.maGiamGia, tamTinh) : null
      const { tienGiam, phiVanChuyen, tongTien } = this.tinhTongTien(tamTinh, giam?.tienGiam ?? 0)

      const khachHang = idTaiKhoan
        ? await manager.findOne(KhachHang, { where: { taiKhoan: { id: idTaiKhoan } } })
        : null

      const donHang = await manager.save(DonHang, {
        ma: 'TZ' + randomBytes(4).toString('hex').toUpperCase(),
        khachHang,
        maGiamGia: giam?.maGiamGia ?? null,
        tenNguoiNhan: dto.tenNguoiNhan,
        soDienThoai: dto.soDienThoai,
        email: dto.email ?? null,
        diaChi: dto.diaChi,
        phiVanChuyen,
        tienGiam,
      })
      await manager.save(ChiTietDonHang, dsSanPham.map((sp) => ({
        donHang,
        sanPham: sp,
        soLuong: soLuongTheoSp.get(sp.id)!,
        donGia: sp.gia,
      })))
      await manager.save(ThanhToan, { donHang, phuongThuc: 'cod', soTien: tongTien })

      return { ma: donHang.ma, trangThai: donHang.trangThai, tamTinh, tienGiam, phiVanChuyen, tongTien }
    })
  }

  async tamTinh(dto: TamTinhDTO) {
    const soLuongTheoSp = this.gopSoLuong(dto.cacDong)
    const dsSanPham = await this.dataSource.getRepository(SanPham).find({ where: { id: In([...soLuongTheoSp.keys()]), trangThai: 'dang_ban' } })
    if (dsSanPham.length !== soLuongTheoSp.size) {
      throw new BadRequestException('Có sản phẩm không tồn tại hoặc đã ngừng bán')
    }

    const tamTinh = dsSanPham.reduce((tong, sp) => tong + sp.gia * soLuongTheoSp.get(sp.id)!, 0)
    let tienGiam = 0
    let thongBaoMa: string | null = null
    if (dto.maGiamGia) {
      try {
        tienGiam = (await this.maGiamGiaService.tinhGiam(dto.maGiamGia, tamTinh)).tienGiam
      } catch (error) {
        if (!(error instanceof BadRequestException)) throw error
        thongBaoMa = error.message
      }
    }
    return { tamTinh, ...this.tinhTongTien(tamTinh, tienGiam), thongBaoMa }
  }

  async timCuaToi(idTaiKhoan: number, loc: LocDonCuaToiDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 10
    const taoTruyVan = () => {
      const truyVan = this.dataSource.getRepository(DonHang).createQueryBuilder('dh')
        .where('dh.id_khach_hang IN (SELECT id FROM khach_hang WHERE id_tai_khoan = :idTaiKhoan)', { idTaiKhoan })
      if (loc.trangThai) truyVan.andWhere('dh.trang_thai = :trangThai', { trangThai: loc.trangThai })
      return truyVan
    }

    const tong = await taoTruyVan().getCount()
    const dong = await taoTruyVan()
      .innerJoin(ChiTietDonHang, 'ct', 'ct.id_don_hang = dh.id')
      .innerJoin(SanPham, 'sp', 'sp.id = ct.id_san_pham')
      .select('dh.ma', 'ma')
      .addSelect('dh.ngay_dat', 'ngayDat')
      .addSelect('dh.trang_thai', 'trangThai')
      .addSelect('MIN(sp.ten)', 'tenSanPhamDau')
      .addSelect('COUNT(ct.id)', 'soDong')
      .addSelect('SUM(ct.so_luong * ct.don_gia) - dh.tien_giam + dh.phi_van_chuyen', 'tongTien')
      .groupBy('dh.id')
      .orderBy('dh.ngay_dat', 'DESC')
      .addOrderBy('dh.id', 'DESC')
      .offset((trang - 1) * soLuong)
      .limit(soLuong)
      .getRawMany<{ ma: string; ngayDat: Date; trangThai: TrangThaiDonHang; tenSanPhamDau: string; soDong: string; tongTien: string }>()

    return {
      duLieu: dong.map((d) => ({ ...d, soDong: Number(d.soDong), tongTien: Number(d.tongTien) })),
      tong,
      trang,
      soLuong,
      tongTrang: Math.ceil(tong / soLuong),
    }
  }

  async xemCuaToi(idTaiKhoan: number, ma: string) {
    const don = await this.dataSource.getRepository(DonHang).findOne({ where: { ma, khachHang: { taiKhoan: { id: idTaiKhoan } } } })
    if (!don) {
      throw new NotFoundException('Không tìm thấy đơn hàng')
    }
    return this.chiTietChoKhach(ma)
  }

  async traCuu(dto: TraCuuDonDTO) {
    const don = await this.dataSource.getRepository(DonHang).findOne({ where: { ma: dto.ma, soDienThoai: dto.soDienThoai } })
    if (!don) {
      throw new NotFoundException('Không tìm thấy đơn hàng khớp với mã đơn và số điện thoại đã nhập')
    }
    return this.chiTietChoKhach(don.ma)
  }

  async huyDon(ma: string, dto: HuyDonDTO, nguoiDung?: NguoiDungHienTai) {
    const don = await this.dataSource.getRepository(DonHang).findOne({ where: { ma }, relations: { khachHang: { taiKhoan: true } } })
    const duocPhep = don && (don.khachHang
      ? nguoiDung?.vaiTro === VaiTro.KHACH_HANG && don.khachHang.taiKhoan.id === nguoiDung.sub
      : dto.soDienThoai === don.soDienThoai)
    if (!duocPhep) {
      throw new NotFoundException('Không tìm thấy đơn hàng')
    }

    await this.donHangQuanLyService.doiTrangThai(ma, TrangThaiDonHang.DA_HUY, nguoiDung?.sub ?? 0, (donDangKhoa) => {
      if (donDangKhoa.trangThai !== TrangThaiDonHang.CHO_XAC_NHAN) {
        throw new ConflictException('Chỉ hủy được đơn đang chờ xác nhận. Đơn đã được xử lý, vui lòng liên hệ cửa hàng')
      }
    })
    return this.chiTietChoKhach(ma)
  }

  private gopSoLuong(cacDong: TamTinhDTO['cacDong']) {
    const soLuongTheoSp = new Map<number, number>()
    for (const dong of cacDong) {
      soLuongTheoSp.set(dong.idSanPham, (soLuongTheoSp.get(dong.idSanPham) ?? 0) + dong.soLuong)
    }
    return soLuongTheoSp
  }

  private tinhTongTien(tamTinh: number, tienGiam: number) {
    const phiVanChuyen = tamTinh >= MIEN_PHI_TU ? 0 : PHI_VAN_CHUYEN
    return { tienGiam, phiVanChuyen, tongTien: tamTinh - tienGiam + phiVanChuyen }
  }

  private async chiTietChoKhach(ma: string) {
    const { nhanVienXuLy, ...chiTiet } = await this.donHangQuanLyService.xemChiTiet(ma)
    void nhanVienXuLy
    return chiTiet
  }
}
