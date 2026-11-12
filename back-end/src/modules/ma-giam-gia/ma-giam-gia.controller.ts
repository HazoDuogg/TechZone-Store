import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaGiamGiaService } from './ma-giam-gia.service';
import { CreateMaGiamGiaDto } from './dto/create-ma-giam-gia.dto';
import { UpdateMaGiamGiaDto } from './dto/update-ma-giam-gia.dto';

@Controller('ma-giam-gia')
export class MaGiamGiaController {
  constructor(private readonly maGiamGiaService: MaGiamGiaService) {}

  @Post()
  create(@Body() createMaGiamGiaDto: CreateMaGiamGiaDto) {
    return this.maGiamGiaService.create(createMaGiamGiaDto);
  }

  @Get()
  findAll() {
    return this.maGiamGiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maGiamGiaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaGiamGiaDto: UpdateMaGiamGiaDto) {
    return this.maGiamGiaService.update(+id, updateMaGiamGiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maGiamGiaService.remove(+id);
  }
}
