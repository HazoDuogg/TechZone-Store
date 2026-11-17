import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DangKyDTO } from './dto/dang-ky.dto';
import { DangNhapDTO } from './dto/dang-nhap.dto';
import { QuenMatKhauDTO } from './dto/quan-mat-khau.dto';
import { DatLaiMatKhauKhachDTO } from './dto/dat-lai-mat-khau-khach.dto';

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

    @Post('quen-mat-khau')
    @HttpCode(HttpStatus.NO_CONTENT)
    quenMatKhau(@Body() dto: QuenMatKhauDTO) {
        return this.authService.quenMatKhau(dto)
    }

    @Post('dat-lai-mat-khau')
    @HttpCode(HttpStatus.NO_CONTENT)
    datLaiMatKhauKhach(@Body() dto: DatLaiMatKhauKhachDTO) {
        return this.authService.datLaiMatKhau(dto)
    }
}
