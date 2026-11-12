import { Injectable } from '@nestjs/common';
import { CreateSanPhamDto } from './dto/create-san-pham.dto';
import { UpdateSanPhamDto } from './dto/update-san-pham.dto';

@Injectable()
export class SanPhamService {
  create(createSanPhamDto: CreateSanPhamDto) {
    return 'This action adds a new sanPham';
  }

  findAll() {
    return `This action returns all sanPham`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sanPham`;
  }

  update(id: number, updateSanPhamDto: UpdateSanPhamDto) {
    return `This action updates a #${id} sanPham`;
  }

  remove(id: number) {
    return `This action removes a #${id} sanPham`;
  }
}
