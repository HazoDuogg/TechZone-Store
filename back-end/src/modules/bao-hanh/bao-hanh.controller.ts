import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { BaoHanhService } from './bao-hanh.service';
import { TiepNhanBaoHanhDTO } from './dto/tiep-nhan-bao-hanh.dto';
import { CapNhatBaoHanhDTO } from './dto/cap-nhat-bao-hanh.dto';
import { LocBaoHanhDTO } from './dto/loc-bao-hanh.dto';
import { TraCuuBaoHanhDTO } from './dto/tra-cuu-bao-hanh.dto';
import { ChiNhanVien } from '../../common/decorators/nhan-vien-decorator';
import { ViTri } from '../../common/enums/vi-tri.enum';
import type { YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';

@Controller('bao-hanh')
@ChiNhanVien(ViTri.KY_THUAT)
export class BaoHanhController {
  constructor(private readonly baoHanhService: BaoHanhService) { }

  @Get()
  timTatCa(@Query() loc: LocBaoHanhDTO) {
    return this.baoHanhService.timTatCa(loc)
  }

  @Get('tra-cuu')
  traCuu(@Query() dto: TraCuuBaoHanhDTO) {
    return this.baoHanhService.traCuu(dto)
  }

  @Post()
  tiepNhan(@Body() dto: TiepNhanBaoHanhDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.baoHanhService.tiepNhan(dto, yeuCau.user!.sub)
  }

  @Patch(':id')
  capNhat(@Param('id', ParseIntPipe) id: number, @Body() dto: CapNhatBaoHanhDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.baoHanhService.capNhat(id, dto, yeuCau.user!.sub)
  }
}
