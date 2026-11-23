import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { DuLieuToken, YeuCauDaXacThuc } from './jwt-auth.guard';
import { layNguoiDungHienTai } from './lay-nguoi-dung';

@Injectable()
export class JwtTuyChonGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const yeuCau = context.switchToHttp().getRequest<YeuCauDaXacThuc>()
        const [loai, token] = yeuCau.headers.authorization?.split(' ') ?? []
        if (loai === 'Bearer' && token) {
            try {
                const duLieuToken = await this.jwtService.verifyAsync<DuLieuToken>(token)
                const hienTai = await layNguoiDungHienTai(this.dataSource, duLieuToken.sub)
                if (hienTai && !hienTai.biKhoa) {
                    yeuCau.user = hienTai.nguoiDung
                }
            } catch { }
        }
        return true
    }
}
