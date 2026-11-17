import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonHang } from './entities/don-hang.entities';
import { DataSource, In, Repository } from 'typeorm';
import { MaGiamGiaService } from '../ma-giam-gia/ma-giam-gia.service';
import { DatHangDTO } from './dto/tao-don-hang.dto';
import { SanPham } from '../san-pham/entities/san-pham.entities';
import { ChiTietSanPham } from '../san-pham/entities/chi-tiet-san-pham.entities';
import { KhachHang } from '../khach-hang/entities/khach-hang.entities';
import { randomBytes } from 'crypto';
import { ChiTietDonHang } from './entities/chi-tiet-don-hang.entities';
import { ThanhToan } from './entities/thanh-toan.entities';

const PHI_VAN_CHUYEN = 30_000
const MIEN_PHI_TU = 5_000_000

@Injectable()
export class DonHangService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly maGiamGiaService: MaGiamGiaService,
  ) { }

  async datHang(dto: DatHangDTO, idTaiKhoan?: number) {
    const soLuongTheoSp = new Map<number, number>()
    for (const dong of dto.cacDong) {
      soLuongTheoSp.set(dong.idSanPham, (soLuongTheoSp.get(dong.idSanPham) ?? 0) + dong.soLuong)
    }
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
      const tienGiam = giam?.tienGiam ?? 0
      const phiVanChuyen = tamTinh >= MIEN_PHI_TU ? 0 : PHI_VAN_CHUYEN
      const tongTien = tamTinh - tienGiam + phiVanChuyen

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
}