import { Injectable } from '@nestjs/common';
import { CreateMaGiamGiaDto } from './dto/create-ma-giam-gia.dto';
import { UpdateMaGiamGiaDto } from './dto/update-ma-giam-gia.dto';

@Injectable()
export class MaGiamGiaService {
  create(createMaGiamGiaDto: CreateMaGiamGiaDto) {
    return 'This action adds a new maGiamGia';
  }

  findAll() {
    return `This action returns all maGiamGia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} maGiamGia`;
  }

  update(id: number, updateMaGiamGiaDto: UpdateMaGiamGiaDto) {
    return `This action updates a #${id} maGiamGia`;
  }

  remove(id: number) {
    return `This action removes a #${id} maGiamGia`;
  }
}
