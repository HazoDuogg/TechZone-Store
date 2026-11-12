import { Injectable } from '@nestjs/common';
import { CreateNhanVienDto } from './dto/create-nhan-vien.dto';
import { UpdateNhanVienDto } from './dto/update-nhan-vien.dto';

@Injectable()
export class NhanVienService {
  create(createNhanVienDto: CreateNhanVienDto) {
    return 'This action adds a new nhanVien';
  }

  findAll() {
    return `This action returns all nhanVien`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nhanVien`;
  }

  update(id: number, updateNhanVienDto: UpdateNhanVienDto) {
    return `This action updates a #${id} nhanVien`;
  }

  remove(id: number) {
    return `This action removes a #${id} nhanVien`;
  }
}
