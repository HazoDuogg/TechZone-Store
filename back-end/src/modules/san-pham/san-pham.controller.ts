import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SanPhamService } from './san-pham.service';
import { LocSanPhamDTO } from './dto/loc-san-pham.dto';

@Controller('san-pham')
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) { }

  @Get()
  timTatCaSanPham(@Query() loc: LocSanPhamDTO) {
    return this.sanPhamService.timTatCaSanPham(loc)
  }

  @Get('thuong-hieu')
  layTheoThuongHieu(@Query('danhMuc', new ParseIntPipe({ optional: true })) danhMuc?: number) {
    return this.sanPhamService.layTheoThuongHieu(danhMuc)
  }

  @Get('goi-y')
  goiYSanPham(@Query('query') query?: string) {
    const tuKhoa = query?.trim()
    if (!tuKhoa || tuKhoa.length < 2)
      return []
    return this.sanPhamService.goiYTimKiem(tuKhoa)
  }

  @Get(':id')
  timChiTietSanPham(@Param('id', ParseIntPipe) id: number) {
    return this.sanPhamService.timChiTietSanPham(id)
  }
}
