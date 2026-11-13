import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, type YeuCauDaXacThuc } from '../../common/guards/jwt-auth.guard';
import { VaiTroGuard } from '../../common/guards/vai-tro.guard';
import { CanVaiTro } from '../../common/decorators/vai-tro.decorator';
import { VaiTro } from '../../common/enums/vai-tro.enum';

@Controller('tai-khoan')
export class TaiKhoanController {
    @UseGuards(JwtAuthGuard, VaiTroGuard)
    @CanVaiTro([VaiTro.ADMIN])
    @Get('chi-admin')
    chiAdmin() {
        return {
            ok: true
        }
    }
}
