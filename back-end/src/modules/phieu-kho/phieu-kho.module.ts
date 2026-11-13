import { Module } from '@nestjs/common';
import { PhieuKhoService } from './phieu-kho.service';
import { PhieuKhoController } from './phieu-kho.controller';
import { PhieuNhapXuat } from './entities/phieu-nhap-xuat.entities';
import { ChiTietPhieuKho } from './entities/chi-tiet-phieu-kho.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PhieuNhapXuat, ChiTietPhieuKho])],
  controllers: [PhieuKhoController],
  providers: [PhieuKhoService],
})
export class PhieuKhoModule { }
