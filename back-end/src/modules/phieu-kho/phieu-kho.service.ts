import { Injectable } from '@nestjs/common';
import { CreatePhieuKhoDto } from './dto/create-phieu-kho.dto';
import { UpdatePhieuKhoDto } from './dto/update-phieu-kho.dto';

@Injectable()
export class PhieuKhoService {
  create(createPhieuKhoDto: CreatePhieuKhoDto) {
    return 'This action adds a new phieuKho';
  }

  findAll() {
    return `This action returns all phieuKho`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phieuKho`;
  }

  update(id: number, updatePhieuKhoDto: UpdatePhieuKhoDto) {
    return `This action updates a #${id} phieuKho`;
  }

  remove(id: number) {
    return `This action removes a #${id} phieuKho`;
  }
}
