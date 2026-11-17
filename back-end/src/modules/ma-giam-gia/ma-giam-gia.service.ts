import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaGiamGia } from './entities/ma-giam-gia.entities';
import { Repository } from 'typeorm';
import { LoaiMaGiamGia } from '../../common/enums/loai-ma-giam-gia.enum';
import { TaoMaGiamGiaDTO } from './dto/tao-ma-giam-gia.dto';
import { CapNhatMaGiamGiaDTO } from './dto/cap-nhat-ma-giam-gia.dto';
import { boGiaTriUndefined } from '../../common/utils/bo-gia-tri-undefined';

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
    Object.assign(maGiamGia, capNhat)
    this.kiemTraGiaTri(maGiamGia.loai, maGiamGia.giaTri)
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
    const homNay = new Date().toLocaleDateString('sv-SE')

    if (!maGiamGia || !maGiamGia.hoatDong || (maGiamGia.ngayHetHan && maGiamGia.ngayHetHan < homNay)) {
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

  private kiemTraGiaTri(loai: LoaiMaGiamGia, giaTri: number) {
    if (loai === LoaiMaGiamGia.PHAN_TRAM && giaTri > 100) {
      throw new BadRequestException('Giảm theo phần trăm không được vượt quá 100')
    }
  }
}
