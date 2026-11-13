import { Injectable } from '@nestjs/common';
import { TaiKhoan } from './entities/tai-khoan.entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaiKhoanService {
    constructor(
        @InjectRepository(TaiKhoan)
        private readonly taiKhoanRepo: Repository<TaiKhoan>
    ) { }

    timTheoEmail(email: string) {
        return this.taiKhoanRepo.findOne({ where: { email } })
    }
}
