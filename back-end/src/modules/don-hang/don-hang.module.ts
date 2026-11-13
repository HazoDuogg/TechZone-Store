import { Module } from '@nestjs/common';
import { DonHangService } from './don-hang.service';
import { DonHangController } from './don-hang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonHang } from './entities/don-hang.entities';
import { ChiTietDonHang } from './entities/chi-tiet-don-hang.entities';
import { ThanhToan } from './entities/thanh-toan.entities';

@Module({
  imports: [TypeOrmModule.forFeature([DonHang, ChiTietDonHang, ThanhToan])],
  controllers: [DonHangController],
  providers: [DonHangService],
})
export class DonHangModule { }
