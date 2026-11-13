import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { VaiTro } from '../enums/vai-tro.enum';

export type DuLieuToken = { sub: number, vaiTro: VaiTro }

export type YeuCauDaXacThuc = Request & { user?: DuLieuToken }

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const yeuCau = context.switchToHttp().getRequest<YeuCauDaXacThuc>()
    const token = this.layToken(yeuCau)

    if (!token) {
      throw new UnauthorizedException('Bạn chưa đăng nhập')
    }

    try {
      yeuCau.user = await this.jwtService.verifyAsync<DuLieuToken>(token)
    } catch (error) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn')
    }
    return true
  }

  private layToken(yeuCau: Request): string | undefined {
    const [loai, token] = yeuCau.headers.authorization?.split(' ') ?? []
    return loai === `Bearer` ? token : undefined
  }
}
