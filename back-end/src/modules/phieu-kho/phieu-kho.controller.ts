import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PhieuKhoService } from './phieu-kho.service';
import { NhapKhoDTO } from './dto/nhap-kho.dto';
import { LocPhieuKhoDTO } from './dto/loc-phieu-kho.dto';
import { XuatKhoDTO } from './dto/xuat-kho.dto';
import { ChiNhanVien } from '../../common/decorators/nhan-vien-decorator';
import { ViTri } from '../../common/enums/vi-tri.enum';
import type { YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';

@Controller('phieu-kho')
@ChiNhanVien(ViTri.KHO)
export class PhieuKhoController {
  constructor(private readonly phieuKhoService: PhieuKhoService) { }

  @Get()
  timTatCa(@Query() loc: LocPhieuKhoDTO) {
    return this.phieuKhoService.timTatCa(loc)
  }

  @Get('san-pham')
  timSanPham(@Query('query') query?: string) {
    return this.phieuKhoService.timSanPham(query?.trim() || undefined)
  }

  @Post('nhap')
  nhapKho(@Body() dto: NhapKhoDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.phieuKhoService.nhapKho(dto, yeuCau.user!.sub)
  }

  @Post('xuat')
  xuatKho(@Body() dto: XuatKhoDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.phieuKhoService.xuatKho(dto, yeuCau.user!.sub)
  }
}
