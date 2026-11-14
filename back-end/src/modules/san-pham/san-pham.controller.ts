import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SanPhamService } from './san-pham.service';
import { LocSanPhamDTO } from './dto/loc-san-pham.dto';

@Controller('san-pham')
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) { }

  @Get()
  timTatCaSanPham(@Query() loc: LocSanPhamDTO) {
    return this.sanPhamService.timTatCaSanPham(loc)
  }
}
