import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SanPhamService } from './san-pham.service';
import { CreateSanPhamDto } from './dto/create-san-pham.dto';
import { UpdateSanPhamDto } from './dto/update-san-pham.dto';

@Controller('san-pham')
export class SanPhamController {
  constructor(private readonly sanPhamService: SanPhamService) {}

  @Post()
  create(@Body() createSanPhamDto: CreateSanPhamDto) {
    return this.sanPhamService.create(createSanPhamDto);
  }

  @Get()
  findAll() {
    return this.sanPhamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sanPhamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSanPhamDto: UpdateSanPhamDto) {
    return this.sanPhamService.update(+id, updateSanPhamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sanPhamService.remove(+id);
  }
}
