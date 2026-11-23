import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { TaiKhoanService } from './tai-khoan.service';
import { DoiMatKhauDTO } from './dto/doi-mat-khau.dto';
import { JwtAuthGuard, type YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';

@Controller('tai-khoan')
export class TaiKhoanController {
    constructor(private readonly taiKhoanService: TaiKhoanService) { }

    @Post('doi-mat-khau')
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    doiMatKhau(@Body() dto: DoiMatKhauDTO, @Req() yeuCau: YeuCauDaXacThuc) {
        return this.taiKhoanService.doiMatKhau(yeuCau.user!.sub, dto)
    }
}
