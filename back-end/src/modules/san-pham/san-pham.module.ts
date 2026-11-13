import { Module } from '@nestjs/common';
import { SanPhamService } from './san-pham.service';
import { SanPhamController } from './san-pham.controller';
import { SanPham } from './entities/san-pham.entities';
import { ChiTietSanPham } from './entities/chi-tiet-san-pham.entities';
import { AnhSanPham } from './entities/anh-san-pham.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SanPham, ChiTietSanPham, AnhSanPham])],
  controllers: [SanPhamController],
  providers: [SanPhamService],
})
export class SanPhamModule { }
