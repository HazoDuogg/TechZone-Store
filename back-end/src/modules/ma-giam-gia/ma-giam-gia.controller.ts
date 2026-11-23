import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { MaGiamGiaService } from './ma-giam-gia.service';
import { TaoMaGiamGiaDTO } from './dto/tao-ma-giam-gia.dto';
import { CapNhatMaGiamGiaDTO } from './dto/cap-nhat-ma-giam-gia.dto';
import { ChiAdmin } from '../../common/decorators/admin-decorator';

@Controller('ma-giam-gia')
@ChiAdmin()
export class MaGiamGiaController {
  constructor(private readonly maGiamGiaService: MaGiamGiaService) { }

  @Get()
  timTatCaMa() {
    return this.maGiamGiaService.timTatCaMa()
  }

  @Post()
  taoMaGiamGia(@Body() dto: TaoMaGiamGiaDTO) {
    return this.maGiamGiaService.taoMaGiamGia(dto)
  }

  @Patch(':id')
  capNhatMaGiamGia(@Param('id', ParseIntPipe) id: number, @Body() dto: CapNhatMaGiamGiaDTO) {
    return this.maGiamGiaService.capNhatMaGiamGia(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  xoaMaGiamGia(@Param('id', ParseIntPipe) id: number) {
    return this.maGiamGiaService.xoaMaGiamGia(id)
  }
}
