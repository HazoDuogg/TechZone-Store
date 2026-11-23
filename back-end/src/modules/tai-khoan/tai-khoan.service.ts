import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TaiKhoan } from './entities/tai-khoan.entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt'
import { DoiMatKhauDTO } from './dto/doi-mat-khau.dto';

@Injectable()
export class TaiKhoanService {
    constructor(
        @InjectRepository(TaiKhoan)
        private readonly taiKhoanRepo: Repository<TaiKhoan>
    ) { }

    timTheoEmail(email: string) {
        return this.taiKhoanRepo.findOne({ where: { email } })
    }

    async doiMatKhau(id: number, dto: DoiMatKhauDTO) {
        const taiKhoan = await this.taiKhoanRepo.findOne({ where: { id } })
        if (!taiKhoan) {
            throw new NotFoundException('Không tìm thấy tài khoản')
        }
        if (!(await bcrypt.compare(dto.matKhauHienTai, taiKhoan.password))) {
            throw new BadRequestException('Mật khẩu hiện tại không đúng')
        }
        if (dto.matKhauHienTai === dto.matKhauMoi) {
            throw new BadRequestException('Mật khẩu mới phải khác mật khẩu hiện tại')
        }
        await this.taiKhoanRepo.update(id, { password: await bcrypt.hash(dto.matKhauMoi, 10) })
    }
}
