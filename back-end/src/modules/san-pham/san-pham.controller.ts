import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { SanPhamService } from './san-pham.service';
import { LocSanPhamDTO } from './dto/loc-san-pham.dto';
import { ChiAdmin } from '../../common/decorators/admin-decorator';
import { ChiNhanVien } from '../../common/decorators/nhan-vien-decorator';
import { ViTri } from '../../common/enums/vi-tri.enum';
import { LocSanPhamQuanTriDTO } from './dto/loc-san-pham-quan-tri.dto';
import { TaoSanPhamDTO } from './dto/tao-san-pham.dto';
import { CapNhatSanPhamDTO } from './dto/cap-nhat-san-pham.dto';
import { LocTheoIdsDTO } from './dto/loc-theo-ids.dto';

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

  @Get('theo-ids')
  timTheoIds(@Query() loc: LocTheoIdsDTO) {
    return this.sanPhamService.timTheoIds(loc.ids)
  }

  @Get('goi-y')
  goiYSanPham(@Query('query') query?: string) {
    const tuKhoa = query?.trim()
    if (!tuKhoa || tuKhoa.length < 2)
      return []
    return this.sanPhamService.goiYTimKiem(tuKhoa)
  }

  @Get('quan-tri')
  @ChiAdmin()
  timTatQuanTri(@Query() loc: LocSanPhamQuanTriDTO) {
    return this.sanPhamService.timTatQuanTri(loc)
  }

  @Get('quan-tri/:id')
  @ChiAdmin()
  timChiTietQuanTri(@Param('id', ParseIntPipe) id: number) {
    return this.sanPhamService.timChiTietQuanTri(id)
  }

  @Get('ton-kho')
  @ChiNhanVien(ViTri.BAN_HANG, ViTri.KY_THUAT, ViTri.KHO)
  timTonKho(@Query() loc: LocSanPhamQuanTriDTO) {
    return this.sanPhamService.timTatQuanTri(loc)
  }

  @Get(':id')
  timChiTietSanPham(@Param('id', ParseIntPipe) id: number) {
    return this.sanPhamService.timChiTietSanPham(id)
  }

  @Post()
  @ChiAdmin()
  taoSanPham(@Body() dto: TaoSanPhamDTO) {
    return this.sanPhamService.taoSanPham(dto)
  }

  @Patch(':id')
  @ChiAdmin()
  capNhatSanPham(@Param('id', ParseIntPipe) id: number, @Body() dto: CapNhatSanPhamDTO) {
    return this.sanPhamService.capNhatSanPham(id, dto)
  }

}
