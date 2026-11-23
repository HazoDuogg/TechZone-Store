import { Body, Controller, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { DonHangQuanLyService } from './don-hang-quan-ly.service';
import { LocDonHangQuanLyDTO } from './dto/loc-don-hang-quan-ly.dto';
import { DoiTrangThaiDonDTO } from './dto/doi-trang-thai-don.dto';
import { DoiSerialDTO } from './dto/doi-serial.dto';
import { ChiNhanVien } from '../../common/decorators/nhan-vien-decorator';
import { ViTri } from '../../common/enums/vi-tri.enum';
import type { YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';

@Controller('don-hang/quan-ly')
@ChiNhanVien(ViTri.BAN_HANG)
export class DonHangQuanLyController {
  constructor(private readonly donHangQuanLyService: DonHangQuanLyService) { }

  @Get()
  timTatQuanLy(@Query() loc: LocDonHangQuanLyDTO) {
    return this.donHangQuanLyService.timTatQuanLy(loc)
  }

  @Get(':ma')
  xemChiTiet(@Param('ma') ma: string) {
    return this.donHangQuanLyService.xemChiTiet(ma.toUpperCase())
  }

  @Patch(':ma/trang-thai')
  doiTrangThai(@Param('ma') ma: string, @Body() dto: DoiTrangThaiDonDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.donHangQuanLyService.doiTrangThai(ma.toUpperCase(), dto.trangThai, yeuCau.user!.sub)
  }

  @Patch(':ma/serial')
  doiSerial(@Param('ma') ma: string, @Body() dto: DoiSerialDTO) {
    return this.donHangQuanLyService.doiSerial(ma.toUpperCase(), dto)
  }
}
