import { Module } from '@nestjs/common';
import { BaoHanhService } from './bao-hanh.service';
import { BaoHanhController } from './bao-hanh.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaoHanh } from './entities/bao-hanh.entities';

@Module({
  imports: [TypeOrmModule.forFeature([BaoHanh])],
  controllers: [BaoHanhController],
  providers: [BaoHanhService],
})
export class BaoHanhModule { }
