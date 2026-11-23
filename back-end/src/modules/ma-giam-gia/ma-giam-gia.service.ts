import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaGiamGia } from './entities/ma-giam-gia.entities';
import { Repository } from 'typeorm';
import { LoaiMaGiamGia } from '../../common/enums/loai-ma-giam-gia.enum';
import { TaoMaGiamGiaDTO } from './dto/tao-ma-giam-gia.dto';
import { CapNhatMaGiamGiaDTO } from './dto/cap-nhat-ma-giam-gia.dto';
import { boGiaTriUndefined } from '../../common/utils/bo-gia-tri-undefined';
import { DonHang } from '../don-hang/entities/don-hang.entities';

const homNay = () => new Date().toLocaleDateString('sv-SE')

@Injectable()
export class MaGiamGiaService {
  constructor(
    @InjectRepository(MaGiamGia)
    private readonly maGiamGiaRepo: Repository<MaGiamGia>
  ) { }

  timTatCaMa() {
    return this.maGiamGiaRepo.find({ order: { id: 'DESC' } })
  }

  async taoMaGiamGia(dto: TaoMaGiamGiaDTO) {
    this.kiemTraGiaTri(dto.loai, dto.giaTri)
    this.kiemTraHanDung(dto.ngayHetHan)

    if (await this.maGiamGiaRepo.existsBy({ ma: dto.ma })) {
      throw new ConflictException('Mã này đã tồn tại')
    }
    return this.maGiamGiaRepo.save(this.maGiamGiaRepo.create(dto))
  }

  async capNhatMaGiamGia(id: number, dto: CapNhatMaGiamGiaDTO) {
    const maGiamGia = await this.timMaTheoId(id)
    const capNhat = boGiaTriUndefined(dto)

    if (dto.ma && dto.ma !== maGiamGia.ma && (await this.maGiamGiaRepo.existsBy({ ma: dto.ma }))) {
      throw new ConflictException('Mã này đã tồn tại')
    }
    await this.kiemTraKhongDoiMaDaDung(maGiamGia, capNhat)
    Object.assign(maGiamGia, capNhat)
    this.kiemTraGiaTri(maGiamGia.loai, maGiamGia.giaTri)
    if (maGiamGia.hoatDong || capNhat.ngayHetHan !== undefined) this.kiemTraHanDung(maGiamGia.ngayHetHan)
    return this.maGiamGiaRepo.save(maGiamGia)
  }

  async xoaMaGiamGia(id: number) {
    const maGiamGia = await this.timMaTheoId(id)

    try {
      await this.maGiamGiaRepo.remove(maGiamGia)
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('Mã đã được dùng trong đơn hàng, hãy tắt hoạt động')
      }
      throw error
    }
  }

  async tinhGiam(ma: string, tamTinh: number) {
    const maGiamGia = await this.maGiamGiaRepo.findOne({ where: { ma: ma.trim().toUpperCase() } })

    if (!maGiamGia || !maGiamGia.hoatDong || (maGiamGia.ngayHetHan && maGiamGia.ngayHetHan < homNay())) {
      throw new BadRequestException('Mã giảm giá không hợp lệ hoặc đã hết hạn')
    }

    if (tamTinh < maGiamGia.donToiThieu) {
      throw new BadRequestException('Đơn hàng chưa đạt giá trị tối thiểu để dùng mã này')
    }

    const tienGiam = maGiamGia.loai === LoaiMaGiamGia.PHAN_TRAM
      ? Math.floor(tamTinh * maGiamGia.giaTri / 100)
      : Math.min(maGiamGia.giaTri, tamTinh)

    return { maGiamGia, tienGiam }
  }

  private async timMaTheoId(id: number) {
    const maGiamGia = await this.maGiamGiaRepo.findOneBy({ id })

    if (!maGiamGia) {
      throw new NotFoundException('Không tìm thấy mã này')
    }
    return maGiamGia;
  }

  private kiemTraHanDung(ngayHetHan: string | null | undefined) {
    if (ngayHetHan && ngayHetHan < homNay()) {
      throw new BadRequestException('Ngày hết hạn phải từ hôm nay trở đi (mã đã quá hạn thì cần gia hạn mới dùng lại được)')
    }
  }

  private async kiemTraKhongDoiMaDaDung(maGiamGia: MaGiamGia, capNhat: Partial<TaoMaGiamGiaDTO>) {
    const doiMaHoacMucGiam = (capNhat.ma !== undefined && capNhat.ma !== maGiamGia.ma)
      || (capNhat.loai !== undefined && capNhat.loai !== maGiamGia.loai)
      || (capNhat.giaTri !== undefined && capNhat.giaTri !== maGiamGia.giaTri)
    if (!doiMaHoacMucGiam) return

    const soDon = await this.maGiamGiaRepo.manager.count(DonHang, { where: { maGiamGia: { id: maGiamGia.id } } })
    if (soDon > 0) {
      throw new ConflictException(`Mã đã được dùng trong ${soDon} đơn hàng nên không đổi được mã hoặc mức giảm, chỉ đổi được hạn dùng, đơn tối thiểu hoặc tắt hoạt động`)
    }
  }

  private kiemTraGiaTri(loai: LoaiMaGiamGia, giaTri: number) {
    if (loai === LoaiMaGiamGia.PHAN_TRAM && giaTri > 100) {
      throw new BadRequestException('Giảm theo phần trăm không được vượt quá 100')
    }
  }
}
