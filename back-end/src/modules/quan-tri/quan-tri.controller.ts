import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuanTriService } from './quan-tri.service';
import { CreateQuanTriDto } from './dto/create-quan-tri.dto';
import { UpdateQuanTriDto } from './dto/update-quan-tri.dto';

@Controller('quan-tri')
export class QuanTriController {
  constructor(private readonly quanTriService: QuanTriService) {}

  @Post()
  create(@Body() createQuanTriDto: CreateQuanTriDto) {
    return this.quanTriService.create(createQuanTriDto);
  }

  @Get()
  findAll() {
    return this.quanTriService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quanTriService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuanTriDto: UpdateQuanTriDto) {
    return this.quanTriService.update(+id, updateQuanTriDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quanTriService.remove(+id);
  }
}
