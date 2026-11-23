import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { KiemKeService } from './kiem-ke.service';
import { KiemKeDTO } from './dto/kiem-ke.dto';
import { PhanTrangDTO } from '../../common/dto/phan-trang.dto';
import { ChiNhanVien } from '../../common/decorators/nhan-vien-decorator';
import { ViTri } from '../../common/enums/vi-tri.enum';
import type { YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';

@Controller('phieu-kho/kiem-ke')
@ChiNhanVien(ViTri.KHO)
export class KiemKeController {
  constructor(private readonly kiemKeService: KiemKeService) { }

  @Get()
  timTatCa(@Query() loc: PhanTrangDTO) {
    return this.kiemKeService.timTatCa(loc)
  }

  @Post()
  tao(@Body() dto: KiemKeDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.kiemKeService.tao(dto, yeuCau.user!.sub)
  }
}
