import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KhachHangService } from './khach-hang.service';
import { CreateKhachHangDto } from './dto/create-khach-hang.dto';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';

@Controller('khach-hang')
export class KhachHangController {
  constructor(private readonly khachHangService: KhachHangService) {}

  @Post()
  create(@Body() createKhachHangDto: CreateKhachHangDto) {
    return this.khachHangService.create(createKhachHangDto);
  }

  @Get()
  findAll() {
    return this.khachHangService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.khachHangService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKhachHangDto: UpdateKhachHangDto) {
    return this.khachHangService.update(+id, updateKhachHangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.khachHangService.remove(+id);
  }
}
