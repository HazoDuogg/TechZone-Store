import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { DonHang } from './entities/don-hang.entities';
import { ChiTietDonHang } from './entities/chi-tiet-don-hang.entities';
import { ThanhToan } from './entities/thanh-toan.entities';
import { ChiTietSanPham } from '../san-pham/entities/chi-tiet-san-pham.entities';
import { NhanVien } from '../nhan-vien/entities/nhan-vien.entities';
import { TrangThaiDonHang } from '../../common/enums/trang-thai-don-hang.enum';
import { LocDonHangQuanLyDTO } from './dto/loc-don-hang-quan-ly.dto';
import { DoiSerialDTO } from './dto/doi-serial.dto';

const NHAN_TRANG_THAI: Record<TrangThaiDonHang, string> = {
  [TrangThaiDonHang.CHO_XAC_NHAN]: 'Chờ xác nhận',
  [TrangThaiDonHang.DA_XAC_NHAN]: 'Đã xác nhận',
  [TrangThaiDonHang.DANG_GIAO]: 'Đang giao',
  [TrangThaiDonHang.HOAN_TAT]: 'Hoàn tất',
  [TrangThaiDonHang.DA_HUY]: 'Đã hủy',
}

const TRANG_THAI_TIEP_THEO: Record<TrangThaiDonHang, TrangThaiDonHang[]> = {
  [TrangThaiDonHang.CHO_XAC_NHAN]: [TrangThaiDonHang.DA_XAC_NHAN, TrangThaiDonHang.DA_HUY],
  [TrangThaiDonHang.DA_XAC_NHAN]: [TrangThaiDonHang.DANG_GIAO, TrangThaiDonHang.DA_HUY],
  [TrangThaiDonHang.DANG_GIAO]: [TrangThaiDonHang.HOAN_TAT, TrangThaiDonHang.DA_HUY],
  [TrangThaiDonHang.HOAN_TAT]: [],
  [TrangThaiDonHang.DA_HUY]: [],
}

@Injectable()
export class DonHangQuanLyService {
  constructor(
    @InjectRepository(DonHang) private readonly donHangRepo: Repository<DonHang>,
    private readonly dataSource: DataSource,
  ) { }

  async timTatQuanLy(loc: LocDonHangQuanLyDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 20

    const tong = await this.locDon(this.donHangRepo.createQueryBuilder('dh'), loc).getCount()

    const dong = await this.locDon(this.donHangRepo.createQueryBuilder('dh'), loc)
      .leftJoin(ChiTietDonHang, 'ct', 'ct.id_don_hang = dh.id')
      .leftJoin(ThanhToan, 'tt', 'tt.id_don_hang = dh.id')
      .select('dh.ma', 'ma')
      .addSelect('dh.ten_nguoi_nhan', 'tenNguoiNhan')
      .addSelect('dh.so_dien_thoai', 'soDienThoai')
      .addSelect('dh.ngay_dat', 'ngayDat')
      .addSelect('dh.trang_thai', 'trangThai')
      .addSelect('MAX(tt.phuong_thuc)', 'phuongThuc')
      .addSelect('COALESCE(SUM(ct.so_luong * ct.don_gia), 0) - dh.tien_giam + dh.phi_van_chuyen', 'tongTien')
      .groupBy('dh.id')
      .orderBy('dh.ngay_dat', 'DESC')
      .addOrderBy('dh.id', 'DESC')
      .offset((trang - 1) * soLuong)
      .limit(soLuong)
      .getRawMany<{ ma: string; tenNguoiNhan: string; soDienThoai: string; ngayDat: Date; trangThai: TrangThaiDonHang; phuongThuc: string | null; tongTien: string }>()

    return {
      duLieu: dong.map((d) => ({ ...d, tongTien: Number(d.tongTien) })),
      tong,
      trang,
      soLuong,
      tongTrang: Math.ceil(tong / soLuong),
    }
  }

  async xemChiTiet(ma: string) {
    const don = await this.donHangRepo.findOne({
      where: { ma },
      relations: { chiTietDonHang: { sanPham: true }, nhanVien: true },
      order: { chiTietDonHang: { id: 'ASC' } },
    })
    if (!don) {
      throw new NotFoundException('Không tìm thấy đơn hàng')
    }

    const idCacDong = don.chiTietDonHang.map((ct) => ct.id)
    const dsSerial = idCacDong.length
      ? await this.dataSource.getRepository(ChiTietSanPham).createQueryBuilder('c')
        .select('c.id_chi_tiet_don_hang', 'idDong')
        .addSelect('c.so_serial', 'soSerial')
        .where('c.id_chi_tiet_don_hang IN (:...idCacDong)', { idCacDong })
        .orderBy('c.id', 'ASC')
        .getRawMany<{ idDong: number; soSerial: string }>()
      : []
    const thanhToan = await this.dataSource.getRepository(ThanhToan).findOne({ where: { donHang: { id: don.id } } })

    const tamTinh = don.chiTietDonHang.reduce((tong, ct) => tong + ct.donGia * ct.soLuong, 0)
    return {
      ma: don.ma,
      trangThai: don.trangThai,
      ngayDat: don.ngayDat,
      ngayHoanTat: don.ngayHoanTat,
      tenNguoiNhan: don.tenNguoiNhan,
      soDienThoai: don.soDienThoai,
      email: don.email,
      diaChi: don.diaChi,
      nhanVienXuLy: don.nhanVien?.hoTen ?? null,
      cacDong: don.chiTietDonHang.map((ct) => ({
        idSanPham: ct.sanPham.id,
        ten: ct.sanPham.ten,
        soLuong: ct.soLuong,
        donGia: ct.donGia,
        cacSerial: dsSerial.filter((s) => s.idDong === ct.id).map((s) => s.soSerial),
      })),
      tamTinh,
      tienGiam: don.tienGiam,
      phiVanChuyen: don.phiVanChuyen,
      tongTien: tamTinh - don.tienGiam + don.phiVanChuyen,
      thanhToan: thanhToan && { phuongThuc: thanhToan.phuongThuc, trangThai: thanhToan.trangThai, ngayThanhToan: thanhToan.ngayThanhToan },
    }
  }

  async doiTrangThai(ma: string, trangThai: TrangThaiDonHang, idTaiKhoan: number, kiemTraThem?: (don: DonHang) => void) {
    await this.dataSource.transaction(async (manager) => {
      const don = await manager.findOne(DonHang, { where: { ma }, lock: { mode: 'pessimistic_write' } })
      if (!don) {
        throw new NotFoundException('Không tìm thấy đơn hàng')
      }
      kiemTraThem?.(don)
      if (!TRANG_THAI_TIEP_THEO[don.trangThai].includes(trangThai)) {
        throw new ConflictException(`Không thể chuyển đơn từ "${NHAN_TRANG_THAI[don.trangThai]}" sang "${NHAN_TRANG_THAI[trangThai]}"`)
      }

      if (trangThai === TrangThaiDonHang.DA_XAC_NHAN) {
        await this.ganSerial(manager, don.id)
        don.nhanVien = await manager.findOne(NhanVien, { where: { taiKhoan: { id: idTaiKhoan } } })
      }
      if (trangThai === TrangThaiDonHang.HOAN_TAT) {
        don.ngayHoanTat = new Date()
        await this.capNhatThanhToan(manager, don.id, 'thanh_cong', new Date())
      }
      if (trangThai === TrangThaiDonHang.DA_HUY) {
        await manager.createQueryBuilder().update(ChiTietSanPham)
          .set({ trangThai: 'trong_kho', chiTietDonHang: null })
          .where('id_chi_tiet_don_hang IN (SELECT id FROM chi_tiet_don_hang WHERE id_don_hang = :idDon)', { idDon: don.id })
          .execute()
        await this.capNhatThanhToan(manager, don.id, 'that_bai', null)
      }

      don.trangThai = trangThai
      await manager.save(don)
    })
    return this.xemChiTiet(ma)
  }

  async doiSerial(ma: string, dto: DoiSerialDTO) {
    await this.dataSource.transaction(async (manager) => {
      const don = await manager.findOne(DonHang, { where: { ma }, lock: { mode: 'pessimistic_write' } })
      if (!don) {
        throw new NotFoundException('Không tìm thấy đơn hàng')
      }
      if (don.trangThai !== TrangThaiDonHang.DA_XAC_NHAN && don.trangThai !== TrangThaiDonHang.DANG_GIAO) {
        throw new ConflictException('Chỉ đổi được serial khi đơn đã xác nhận hoặc đang giao')
      }

      const cu = await manager.createQueryBuilder(ChiTietSanPham, 'c')
        .innerJoinAndSelect('c.chiTietDonHang', 'ct')
        .innerJoinAndSelect('ct.sanPham', 'sp')
        .where('c.so_serial = :soSerial AND ct.id_don_hang = :idDon', { soSerial: dto.soSerialCu, idDon: don.id })
        .setLock('pessimistic_write')
        .getOne()
      if (!cu) {
        throw new NotFoundException('Serial cũ không thuộc đơn hàng này')
      }

      const moi = await manager.createQueryBuilder(ChiTietSanPham, 'c')
        .innerJoinAndSelect('c.sanPham', 'spMoi')
        .where('c.so_serial = :soSerial', { soSerial: dto.soSerialMoi })
        .setLock('pessimistic_write')
        .getOne()
      if (!moi) {
        throw new NotFoundException('Không tìm thấy serial mới')
      }
      if (moi.sanPham.id !== cu.chiTietDonHang!.sanPham.id) {
        throw new ConflictException('Serial mới không cùng sản phẩm với serial cũ')
      }
      if (moi.trangThai !== 'trong_kho') {
        throw new ConflictException('Serial mới không còn trong kho')
      }

      moi.trangThai = 'da_ban'
      moi.chiTietDonHang = cu.chiTietDonHang
      cu.trangThai = dto.danhDauLoi ? 'loi' : 'trong_kho'
      cu.chiTietDonHang = null
      await manager.save([cu, moi])
    })
    return this.xemChiTiet(ma)
  }

  private locDon(query: SelectQueryBuilder<DonHang>, loc: LocDonHangQuanLyDTO) {
    if (loc.trangThai) query.andWhere('dh.trang_thai = :trangThai', { trangThai: loc.trangThai })
    if (loc.query) query.andWhere('(dh.ma LIKE :q OR dh.ten_nguoi_nhan LIKE :q OR dh.so_dien_thoai LIKE :q)', { q: `%${loc.query}%` })
    return query
  }

  private async ganSerial(manager: EntityManager, idDon: number) {
    const cacDong = await manager.find(ChiTietDonHang, { where: { donHang: { id: idDon } }, relations: { sanPham: true }, order: { id: 'ASC' } })

    for (const dong of cacDong) {
      const cacSerial = await manager.createQueryBuilder(ChiTietSanPham, 'c')
        .where('c.id_san_pham = :idSanPham', { idSanPham: dong.sanPham.id })
        .andWhere("c.trang_thai = 'trong_kho'")
        .orderBy('c.ngay_nhap', 'ASC')
        .addOrderBy('c.id', 'ASC')
        .limit(dong.soLuong)
        .setLock('pessimistic_write')
        .getMany()

      if (cacSerial.length < dong.soLuong) {
        throw new ConflictException(`"${dong.sanPham.ten}" chỉ còn ${cacSerial.length} sản phẩm trong kho, đơn cần ${dong.soLuong}`)
      }
      for (const serial of cacSerial) {
        serial.trangThai = 'da_ban'
        serial.chiTietDonHang = dong
      }
      await manager.save(cacSerial)
    }
  }

  private capNhatThanhToan(manager: EntityManager, idDon: number, trangThai: ThanhToan['trangThai'], ngayThanhToan: Date | null) {
    return manager.createQueryBuilder().update(ThanhToan).set({ trangThai, ngayThanhToan }).where('id_don_hang = :idDon', { idDon }).execute()
  }
}
