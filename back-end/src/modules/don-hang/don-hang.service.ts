import { Injectable } from '@nestjs/common';
import { CreateDonHangDto } from './dto/create-don-hang.dto';
import { UpdateDonHangDto } from './dto/update-don-hang.dto';

@Injectable()
export class DonHangService {
  create(createDonHangDto: CreateDonHangDto) {
    return 'This action adds a new donHang';
  }

  findAll() {
    return `This action returns all donHang`;
  }

  findOne(id: number) {
    return `This action returns a #${id} donHang`;
  }

  update(id: number, updateDonHangDto: UpdateDonHangDto) {
    return `This action updates a #${id} donHang`;
  }

  remove(id: number) {
    return `This action removes a #${id} donHang`;
  }
}
