import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DanhMucService } from './danh-muc.service';
import { ChiAdmin } from '../../common/decorators/admin-decorator';
import { TaoDanhMucDTO } from './dto/tao-danh-muc.dto';
import { CapNhatDanhMucDTO } from './dto/cap-nhat-danh-muc.dto';

@Controller('danh-muc')
export class DanhMucController {
    constructor(private readonly danhMucService: DanhMucService) { }

    @Get()
    timTatCaDanhMuc() {
        return this.danhMucService.timTatCaDanhMuc()
    }

    @Post()
    @ChiAdmin()
    taoDanhMuc(@Body() dto: TaoDanhMucDTO) {
        return this.danhMucService.taoDanhMuc(dto)
    }

    @Patch(':id')
    @ChiAdmin()
    capNhatDanhMuc(@Param('id', ParseIntPipe) id: number, @Body() dto: CapNhatDanhMucDTO) {
        return this.danhMucService.capNhatDanhMuc(id, dto)
    }

    @Delete(':id')
    @ChiAdmin()
    @HttpCode(HttpStatus.NO_CONTENT)
    xoaDanhMuc(@Param('id', ParseIntPipe) id: number) {
        return this.danhMucService.xoaDanhMuc(id)
    }
}
