import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { NhanVienService } from './nhan-vien.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VaiTroGuard } from '../../common/guards/vai-tro.guard';
import { CanVaiTro } from '../../common/decorators/vai-tro.decorator';
import { VaiTro } from '../../common/enums/vai-tro.enum';
import { TaoNhanVienDTO } from './dto/tao-nhan-vien.dto';
import { CapNhanNhanVienDTO } from './dto/cap-nhat-nhan-vien.dto';
import { DatLaiMatKhauDTO } from './dto/dat-lai-mat-khau.dto';

@Controller('nhan-vien')
@UseGuards(JwtAuthGuard, VaiTroGuard)
@CanVaiTro([VaiTro.ADMIN])
export class NhanVienController {
  constructor(private readonly nhanVienService: NhanVienService) { }

  @Get()
  timTatCaNhanVien() {
    return this.nhanVienService.timTatCaNhanVien()
  }

  @Post()
  taoNhanVien(@Body() dto: TaoNhanVienDTO) {
    return this.nhanVienService.taoNhanVien(dto)
  }

  @Patch(':id')
  capNhatNhanVien(@Param('id', ParseIntPipe) id: number, @Body() dto: CapNhanNhanVienDTO) {
    return this.nhanVienService.capNhatNhanVien(id, dto)
  }

  @Post(':id/dat-lai-mat-khau')
  @HttpCode(HttpStatus.NO_CONTENT)
  datLaiMatKhau(@Param('id', ParseIntPipe) id: number, @Body() dto: DatLaiMatKhauDTO) {
    return this.nhanVienService.datLaiMatKhau(id, dto)
  }
}
