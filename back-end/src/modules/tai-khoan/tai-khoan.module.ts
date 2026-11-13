import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaiKhoanController } from './tai-khoan.controller';
import { TaiKhoanService } from './tai-khoan.service';
import { TaiKhoan } from './entities/tai-khoan.entities';

@Module({
    imports: [TypeOrmModule.forFeature([TaiKhoan])],
    controllers: [TaiKhoanController],
    providers: [TaiKhoanService],
    exports: [TaiKhoanService]
})
export class TaiKhoanModule { }
