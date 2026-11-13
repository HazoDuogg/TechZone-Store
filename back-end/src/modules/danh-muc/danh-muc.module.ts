import { Module } from '@nestjs/common';
import { DanhMucController } from './danh-muc.controller';
import { DanhMucService } from './danh-muc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DanhMuc } from './entities/danh-muc.entities';

@Module({
  imports: [TypeOrmModule.forFeature([DanhMuc])],
  controllers: [DanhMucController],
  providers: [DanhMucService]
})
export class DanhMucModule { }
