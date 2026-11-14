import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DanhMuc } from './entities/danh-muc.entities';
import { Repository } from 'typeorm';

@Injectable()
export class DanhMucService {
    constructor(
        @InjectRepository(DanhMuc)
        private readonly danhMucRepo: Repository<DanhMuc>
    ) { }

    timTatCa() {
        return this.danhMucRepo.find({ order: { id: 'ASC' } })
    }
}
