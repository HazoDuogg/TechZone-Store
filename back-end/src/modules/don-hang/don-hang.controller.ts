import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, HttpCode } from '@nestjs/common';
import { DonHangService } from './don-hang.service';
import { JwtTuyChonGuard } from '../../common/guards/jwt-tuy-chon.guard';
import { DatHangDTO, TamTinhDTO } from './dto/tao-don-hang.dto';
import type { YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';
import { VaiTro } from '../../common/enums/vai-tro.enum';
import { ChiKhachHang } from '../../common/decorators/khach-hang-decorator';
import { LocDonCuaToiDTO } from './dto/loc-don-cua-toi.dto';
import { HuyDonDTO, TraCuuDonDTO } from './dto/tra-cuu-don.dto';

@Controller('don-hang')
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) { }

  @Post()
  @UseGuards(JwtTuyChonGuard)
  datHang(@Body() dto: DatHangDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    const idTaiKhoan = yeuCau.user?.vaiTro === VaiTro.KHACH_HANG ? yeuCau.user.sub : undefined
    return this.donHangService.datHang(dto, idTaiKhoan)
  }

  @Post('tam-tinh')
  @HttpCode(200)
  tamTinh(@Body() dto: TamTinhDTO) {
    return this.donHangService.tamTinh(dto)
  }

  @Get('cua-toi')
  @ChiKhachHang()
  timCuaToi(@Query() loc: LocDonCuaToiDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.donHangService.timCuaToi(yeuCau.user!.sub, loc)
  }

  @Get('cua-toi/:ma')
  @ChiKhachHang()
  xemCuaToi(@Param('ma') ma: string, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.donHangService.xemCuaToi(yeuCau.user!.sub, ma)
  }

  @Post('tra-cuu')
  @HttpCode(200)
  traCuu(@Body() dto: TraCuuDonDTO) {
    return this.donHangService.traCuu(dto)
  }

  @Post(':ma/huy')
  @HttpCode(200)
  @UseGuards(JwtTuyChonGuard)
  huyDon(@Param('ma') ma: string, @Body() dto: HuyDonDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.donHangService.huyDon(ma, dto, yeuCau.user)
  }
}
