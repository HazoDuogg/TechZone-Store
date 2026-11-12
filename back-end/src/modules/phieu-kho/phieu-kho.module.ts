import { Module } from '@nestjs/common';
import { PhieuKhoService } from './phieu-kho.service';
import { PhieuKhoController } from './phieu-kho.controller';

@Module({
  controllers: [PhieuKhoController],
  providers: [PhieuKhoService],
})
export class PhieuKhoModule {}
