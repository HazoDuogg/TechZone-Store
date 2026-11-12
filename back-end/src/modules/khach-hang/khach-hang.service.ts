import { Injectable } from '@nestjs/common';
import { CreateKhachHangDto } from './dto/create-khach-hang.dto';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';

@Injectable()
export class KhachHangService {
  create(createKhachHangDto: CreateKhachHangDto) {
    return 'This action adds a new khachHang';
  }

  findAll() {
    return `This action returns all khachHang`;
  }

  findOne(id: number) {
    return `This action returns a #${id} khachHang`;
  }

  update(id: number, updateKhachHangDto: UpdateKhachHangDto) {
    return `This action updates a #${id} khachHang`;
  }

  remove(id: number) {
    return `This action removes a #${id} khachHang`;
  }
}
