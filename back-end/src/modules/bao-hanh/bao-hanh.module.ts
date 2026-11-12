import { Module } from '@nestjs/common';
import { BaoHanhService } from './bao-hanh.service';
import { BaoHanhController } from './bao-hanh.controller';

@Module({
  controllers: [BaoHanhController],
  providers: [BaoHanhService],
})
export class BaoHanhModule {}
