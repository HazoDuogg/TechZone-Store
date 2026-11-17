import { Module } from '@nestjs/common';
import { DonHangService } from './don-hang.service';
import { DonHangController } from './don-hang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonHang } from './entities/don-hang.entities';
import { ChiTietDonHang } from './entities/chi-tiet-don-hang.entities';
import { ThanhToan } from './entities/thanh-toan.entities';
import { MaGiamGiaModule } from '../ma-giam-gia/ma-giam-gia.module';

@Module({
  imports: [TypeOrmModule.forFeature([DonHang, ChiTietDonHang, ThanhToan]), MaGiamGiaModule],
  controllers: [DonHangController],
  providers: [DonHangService],
})
export class DonHangModule { }
