import { Module } from '@nestjs/common';
import { MaGiamGiaService } from './ma-giam-gia.service';
import { MaGiamGiaController } from './ma-giam-gia.controller';
import { MaGiamGia } from './entities/ma-giam-gia.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MaGiamGia])],
  controllers: [MaGiamGiaController],
  providers: [MaGiamGiaService],
})
export class MaGiamGiaModule { }
