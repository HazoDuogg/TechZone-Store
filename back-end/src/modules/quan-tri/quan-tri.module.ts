import { Module } from '@nestjs/common';
import { QuanTriService } from './quan-tri.service';
import { QuanTriController } from './quan-tri.controller';

@Module({
  controllers: [QuanTriController],
  providers: [QuanTriService],
})
export class QuanTriModule {}
