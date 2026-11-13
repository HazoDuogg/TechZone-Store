import { Module } from '@nestjs/common';
import { KhachHangService } from './khach-hang.service';
import { KhachHangController } from './khach-hang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhachHang } from './entities/khach-hang.entities';
import { DiaChiGiaoHang } from './entities/dia-chi.entities';

@Module({
  imports: [TypeOrmModule.forFeature([KhachHang, DiaChiGiaoHang])],
  controllers: [KhachHangController],
  providers: [KhachHangService],
})
export class KhachHangModule { }
