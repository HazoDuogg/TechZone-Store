import { Injectable } from '@nestjs/common';
import { CreateBaoHanhDto } from './dto/create-bao-hanh.dto';
import { UpdateBaoHanhDto } from './dto/update-bao-hanh.dto';

@Injectable()
export class BaoHanhService {
  create(createBaoHanhDto: CreateBaoHanhDto) {
    return 'This action adds a new baoHanh';
  }

  findAll() {
    return `This action returns all baoHanh`;
  }

  findOne(id: number) {
    return `This action returns a #${id} baoHanh`;
  }

  update(id: number, updateBaoHanhDto: UpdateBaoHanhDto) {
    return `This action updates a #${id} baoHanh`;
  }

  remove(id: number) {
    return `This action removes a #${id} baoHanh`;
  }
}
