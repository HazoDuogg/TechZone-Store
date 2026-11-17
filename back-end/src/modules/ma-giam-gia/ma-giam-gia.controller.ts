import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { MaGiamGiaService } from './ma-giam-gia.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VaiTroGuard } from '../../common/guards/vai-tro.guard';
import { CanVaiTro } from '../../common/decorators/vai-tro.decorator';
import { VaiTro } from '../../common/enums/vai-tro.enum';
import { TaoMaGiamGiaDTO } from './dto/tao-ma-giam-gia.dto';
import { CapNhatMaGiamGiaDTO } from './dto/cap-nhat-ma-giam-gia.dto';

@Controller('ma-giam-gia')
@UseGuards(JwtAuthGuard, VaiTroGuard)
@CanVaiTro([VaiTro.ADMIN])
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
