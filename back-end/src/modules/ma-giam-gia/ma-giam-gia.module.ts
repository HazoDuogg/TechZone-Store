import { Module } from '@nestjs/common';
import { MaGiamGiaService } from './ma-giam-gia.service';
import { MaGiamGiaController } from './ma-giam-gia.controller';

@Module({
  controllers: [MaGiamGiaController],
  providers: [MaGiamGiaService],
})
export class MaGiamGiaModule {}
