import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhieuKhoService } from './phieu-kho.service';
import { CreatePhieuKhoDto } from './dto/create-phieu-kho.dto';
import { UpdatePhieuKhoDto } from './dto/update-phieu-kho.dto';

@Controller('phieu-kho')
export class PhieuKhoController {
  constructor(private readonly phieuKhoService: PhieuKhoService) {}

  @Post()
  create(@Body() createPhieuKhoDto: CreatePhieuKhoDto) {
    return this.phieuKhoService.create(createPhieuKhoDto);
  }

  @Get()
  findAll() {
    return this.phieuKhoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phieuKhoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhieuKhoDto: UpdatePhieuKhoDto) {
    return this.phieuKhoService.update(+id, updatePhieuKhoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phieuKhoService.remove(+id);
  }
}
