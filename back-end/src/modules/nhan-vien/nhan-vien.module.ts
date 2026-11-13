import { Module } from '@nestjs/common';
import { NhanVienService } from './nhan-vien.service';
import { NhanVienController } from './nhan-vien.controller';
import { NhanVien } from './entities/nhan-vien.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([NhanVien])],
  controllers: [NhanVienController],
  providers: [NhanVienService],
})
export class NhanVienModule { }
