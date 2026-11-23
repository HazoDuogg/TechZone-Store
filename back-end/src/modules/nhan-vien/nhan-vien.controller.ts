import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { NhanVienService } from './nhan-vien.service';
import { TaoNhanVienDTO } from './dto/tao-nhan-vien.dto';
import { CapNhanNhanVienDTO } from './dto/cap-nhat-nhan-vien.dto';
import { DatLaiMatKhauDTO } from './dto/dat-lai-mat-khau.dto';
import { ChiAdmin } from '../../common/decorators/admin-decorator';

@Controller('nhan-vien')
@ChiAdmin()
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
