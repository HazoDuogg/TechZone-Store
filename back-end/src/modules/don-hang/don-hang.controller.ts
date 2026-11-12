import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonHangService } from './don-hang.service';
import { CreateDonHangDto } from './dto/create-don-hang.dto';
import { UpdateDonHangDto } from './dto/update-don-hang.dto';

@Controller('don-hang')
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) {}

  @Post()
  create(@Body() createDonHangDto: CreateDonHangDto) {
    return this.donHangService.create(createDonHangDto);
  }

  @Get()
  findAll() {
    return this.donHangService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donHangService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonHangDto: UpdateDonHangDto) {
    return this.donHangService.update(+id, updateDonHangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donHangService.remove(+id);
  }
}
