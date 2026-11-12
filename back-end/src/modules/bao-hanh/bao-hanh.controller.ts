import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BaoHanhService } from './bao-hanh.service';
import { CreateBaoHanhDto } from './dto/create-bao-hanh.dto';
import { UpdateBaoHanhDto } from './dto/update-bao-hanh.dto';

@Controller('bao-hanh')
export class BaoHanhController {
  constructor(private readonly baoHanhService: BaoHanhService) {}

  @Post()
  create(@Body() createBaoHanhDto: CreateBaoHanhDto) {
    return this.baoHanhService.create(createBaoHanhDto);
  }

  @Get()
  findAll() {
    return this.baoHanhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baoHanhService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBaoHanhDto: UpdateBaoHanhDto) {
    return this.baoHanhService.update(+id, updateBaoHanhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.baoHanhService.remove(+id);
  }
}
