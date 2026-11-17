import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DonHangService } from './don-hang.service';
import { JwtTuyChonGuard } from '../../common/guards/jwt-tuy-chon.guard';
import { DatHangDTO } from './dto/tao-don-hang.dto';
import type { YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';
import { VaiTro } from '../../common/enums/vai-tro.enum';

@Controller('don-hang')
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) { }

  @Post()
  @UseGuards(JwtTuyChonGuard)
  datHang(@Body() dto: DatHangDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    const idTaiKhoan = yeuCau.user?.vaiTro === VaiTro.KHACH_HANG ? yeuCau.user.sub : undefined
    return this.donHangService.datHang(dto, idTaiKhoan)
  }
}
