import { taoMaPhieu } from '../../common/utils/dinh-dang-ma';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { PhieuKiemKe } from './entities/phieu-kiem-ke.entities';
import { ChiTietKiemKe } from './entities/chi-tiet-kiem-ke.entities';
import { SanPham } from '../san-pham/entities/san-pham.entities';
import { ChiTietSanPham } from '../san-pham/entities/chi-tiet-san-pham.entities';
import { NhanVien } from '../nhan-vien/entities/nhan-vien.entities';
import { PhanTrangDTO } from '../../common/dto/phan-trang.dto';
import { KiemKeDTO } from './dto/kiem-ke.dto';


const tomTat = (cacDong: { idSanPham: number; ten: string; tonHeThong: number; tonThucTe: number }[]) => {
  const cacDongCoChenhLech = cacDong.map((dong) => ({ ...dong, chenhLech: dong.tonThucTe - dong.tonHeThong }))
  return {
    soSanPham: cacDongCoChenhLech.length,
    soSanPhamLech: cacDongCoChenhLech.filter((dong) => dong.chenhLech !== 0).length,
    tongChenhLech: cacDongCoChenhLech.reduce((tong, dong) => tong + dong.chenhLech, 0),
    cacDong: cacDongCoChenhLech,
  }
}

@Injectable()
export class KiemKeService {
  constructor(
    @InjectRepository(PhieuKiemKe) private readonly phieuRepo: Repository<PhieuKiemKe>,
    private readonly dataSource: DataSource,
  ) { }

  async timTatCa(loc: PhanTrangDTO) {
    const trang = loc.trang ?? 1
    const soLuong = loc.soLuong ?? 10

    const [dsPhieu, tong] = await this.phieuRepo.createQueryBuilder('p')
      .innerJoinAndSelect('p.nhanVien', 'nv')
      .orderBy('p.id', 'DESC')
      .skip((trang - 1) * soLuong)
      .take(soLuong)
      .getManyAndCount()

    const ids = dsPhieu.map((p) => p.id)
    const cacDong = ids.length
      ? await this.dataSource.getRepository(ChiTietKiemKe).createQueryBuilder('ct')
        .innerJoin('ct.sanPham', 'sp')
        .select('ct.id_phieu_kiem_ke', 'idPhieu')
        .addSelect('sp.id', 'idSanPham')
        .addSelect('sp.ten', 'ten')
        .addSelect('ct.ton_he_thong', 'tonHeThong')
        .addSelect('ct.ton_thuc_te', 'tonThucTe')
        .where('ct.id_phieu_kiem_ke IN (:...ids)', { ids })
        .orderBy('ct.id', 'ASC')
        .getRawMany<{ idPhieu: number; idSanPham: number; ten: string; tonHeThong: number; tonThucTe: number }>()
      : []

    return {
      duLieu: dsPhieu.map((p) => ({
        id: p.id,
        ma: taoMaPhieu('KK', p.id),
        ngayLap: p.ngayLap,
        nhanVien: p.nhanVien.hoTen,
        ghiChu: p.ghiChu,
        ...tomTat(cacDong.filter((d) => d.idPhieu === p.id).map(({ idSanPham, ten, tonHeThong, tonThucTe }) => ({ idSanPham, ten, tonHeThong, tonThucTe }))),
      })),
      tong,
      trang,
      soLuong,
      tongTrang: Math.ceil(tong / soLuong),
    }
  }

  async tao(dto: KiemKeDTO, idTaiKhoan: number) {
    const nhanVien = await this.dataSource.getRepository(NhanVien).findOne({ where: { taiKhoan: { id: idTaiKhoan } } })
    if (!nhanVien) {
      throw new ForbiddenException('Chỉ nhân viên kho mới lập được biên bản kiểm kê')
    }

    const ids = dto.cacDong.map((dong) => dong.idSanPham)
    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException('Một sản phẩm chỉ được xuất hiện một lần trong biên bản')
    }

    return this.dataSource.transaction(async (manager) => {
      const dsSanPham = await manager.find(SanPham, { where: { id: In(ids) } })
      const thieu = ids.find((id) => !dsSanPham.some((sp) => sp.id === id))
      if (thieu) {
        throw new NotFoundException('Không tìm thấy sản phẩm có mã ' + thieu)
      }

      const tonHienTai = await manager.createQueryBuilder(ChiTietSanPham, 'c')
        .select('c.id_san_pham', 'idSanPham')
        .addSelect('COUNT(*)', 'soLuong')
        .where('c.id_san_pham IN (:...ids)', { ids })
        .andWhere("c.trang_thai = 'trong_kho'")
        .groupBy('c.id_san_pham')
        .getRawMany<{ idSanPham: number; soLuong: string }>()
      const tonHeThong = (id: number) => Number(tonHienTai.find((t) => t.idSanPham === id)?.soLuong ?? 0)

      const phieu = await manager.save(PhieuKiemKe, { nhanVien, ghiChu: dto.ghiChu ?? null })
      const cacDong = dto.cacDong.map((dong) => ({ idSanPham: dong.idSanPham, ten: dsSanPham.find((sp) => sp.id === dong.idSanPham)!.ten, tonHeThong: tonHeThong(dong.idSanPham), tonThucTe: dong.tonThucTe }))
      await manager.save(ChiTietKiemKe, cacDong.map((dong) => ({ phieuKiemKe: phieu, sanPham: { id: dong.idSanPham }, tonHeThong: dong.tonHeThong, tonThucTe: dong.tonThucTe })))

      return { id: phieu.id, ma: taoMaPhieu('KK', phieu.id), ngayLap: phieu.ngayLap, nhanVien: nhanVien.hoTen, ghiChu: phieu.ghiChu, ...tomTat(cacDong) }
    })
  }
}
