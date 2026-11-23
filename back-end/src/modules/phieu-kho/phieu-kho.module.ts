import { Module } from '@nestjs/common';
import { PhieuKhoService } from './phieu-kho.service';
import { PhieuKhoController } from './phieu-kho.controller';
import { KiemKeService } from './kiem-ke.service';
import { KiemKeController } from './kiem-ke.controller';
import { PhieuNhapXuat } from './entities/phieu-nhap-xuat.entities';
import { ChiTietPhieuKho } from './entities/chi-tiet-phieu-kho.entities';
import { PhieuKiemKe } from './entities/phieu-kiem-ke.entities';
import { ChiTietKiemKe } from './entities/chi-tiet-kiem-ke.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PhieuNhapXuat, ChiTietPhieuKho, PhieuKiemKe, ChiTietKiemKe])],
  controllers: [PhieuKhoController, KiemKeController],
  providers: [PhieuKhoService, KiemKeService],
})
export class PhieuKhoModule { }
