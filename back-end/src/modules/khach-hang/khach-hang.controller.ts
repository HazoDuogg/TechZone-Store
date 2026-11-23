import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { KhachHangService } from './khach-hang.service';
import { CapNhatHoSoDTO } from './dto/cap-nhat-ho-so.dto';
import { CapNhatDiaChiDTO, LuuDiaChiDTO } from './dto/dia-chi.dto';
import { ChiKhachHang } from '../../common/decorators/khach-hang-decorator';
import { ChiNhanVien } from '../../common/decorators/nhan-vien-decorator';
import { ViTri } from '../../common/enums/vi-tri.enum';
import { LocKhachHangDTO } from './dto/loc-khach-hang.dto';
import { CapNhatGhiChuDTO } from './dto/cap-nhat-ghi-chu.dto';
import type { YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';

@Controller('khach-hang')
export class KhachHangController {
  constructor(private readonly khachHangService: KhachHangService) { }

  @Get('toi')
  @ChiKhachHang()
  xemHoSo(@Req() yeuCau: YeuCauDaXacThuc) {
    return this.khachHangService.xemHoSo(yeuCau.user!.sub)
  }

  @Patch('toi')
  @ChiKhachHang()
  capNhatHoSo(@Body() dto: CapNhatHoSoDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.khachHangService.capNhatHoSo(yeuCau.user!.sub, dto)
  }

  @Get('toi/dia-chi')
  @ChiKhachHang()
  layDiaChi(@Req() yeuCau: YeuCauDaXacThuc) {
    return this.khachHangService.layDiaChi(yeuCau.user!.sub)
  }

  @Post('toi/dia-chi')
  @ChiKhachHang()
  themDiaChi(@Body() dto: LuuDiaChiDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.khachHangService.themDiaChi(yeuCau.user!.sub, dto)
  }

  @Patch('toi/dia-chi/:id')
  @ChiKhachHang()
  capNhatDiaChi(@Param('id', ParseIntPipe) id: number, @Body() dto: CapNhatDiaChiDTO, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.khachHangService.capNhatDiaChi(yeuCau.user!.sub, id, dto)
  }

  @Delete('toi/dia-chi/:id')
  @ChiKhachHang()
  @HttpCode(204)
  xoaDiaChi(@Param('id', ParseIntPipe) id: number, @Req() yeuCau: YeuCauDaXacThuc) {
    return this.khachHangService.xoaDiaChi(yeuCau.user!.sub, id)
  }

  @Get()
  @ChiNhanVien(ViTri.BAN_HANG)
  timTatCa(@Query() loc: LocKhachHangDTO) {
    return this.khachHangService.timTatCa(loc)
  }

  @Get(':id')
  @ChiNhanVien(ViTri.BAN_HANG)
  xemChiTiet(@Param('id', ParseIntPipe) id: number) {
    return this.khachHangService.xemChiTiet(id)
  }

  @Patch(':id')
  @ChiNhanVien(ViTri.BAN_HANG)
  capNhatGhiChu(@Param('id', ParseIntPipe) id: number, @Body() dto: CapNhatGhiChuDTO) {
    return this.khachHangService.capNhatGhiChu(id, dto)
  }
}
