import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DangKyDTO } from './dto/dang-ky.dto';
import { DangNhapDTO } from './dto/dang-nhap.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('dang-ky')
    dangKy(@Body() dto: DangKyDTO) {
        return this.authService.dangKy(dto)
    }

    @Post('dang-nhap')
    @HttpCode(HttpStatus.OK)
    dangNhap(@Body() dto: DangNhapDTO) {
        return this.authService.dangNhap(dto)
    }
}
