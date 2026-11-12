import { Injectable } from '@nestjs/common';
import { CreateQuanTriDto } from './dto/create-quan-tri.dto';
import { UpdateQuanTriDto } from './dto/update-quan-tri.dto';

@Injectable()
export class QuanTriService {
  create(createQuanTriDto: CreateQuanTriDto) {
    return 'This action adds a new quanTri';
  }

  findAll() {
    return `This action returns all quanTri`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quanTri`;
  }

  update(id: number, updateQuanTriDto: UpdateQuanTriDto) {
    return `This action updates a #${id} quanTri`;
  }

  remove(id: number) {
    return `This action removes a #${id} quanTri`;
  }
}
