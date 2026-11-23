import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { VaiTro } from '../enums/vai-tro.enum';
import { ViTri } from '../enums/vi-tri.enum';
import { layNguoiDungHienTai } from './lay-nguoi-dung';

export type DuLieuToken = { sub: number, vaiTro: VaiTro }

export type NguoiDungHienTai = { sub: number, vaiTro: VaiTro, viTri?: ViTri }

export type YeuCauDaXacThuc = Request & { user?: NguoiDungHienTai }

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const yeuCau = context.switchToHttp().getRequest<YeuCauDaXacThuc>()
    const token = this.layToken(yeuCau)

    if (!token) {
      throw new UnauthorizedException('Bạn chưa đăng nhập')
    }

    let duLieuToken: DuLieuToken
    try {
      duLieuToken = await this.jwtService.verifyAsync<DuLieuToken>(token)
    } catch {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn')
    }

    const hienTai = await layNguoiDungHienTai(this.dataSource, duLieuToken.sub)
    if (!hienTai) {
      throw new UnauthorizedException('Tài khoản không còn tồn tại')
    }
    if (hienTai.biKhoa) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa')
    }

    yeuCau.user = hienTai.nguoiDung
    return true
  }

  private layToken(yeuCau: Request): string | undefined {
    const [loai, token] = yeuCau.headers.authorization?.split(' ') ?? []
    return loai === `Bearer` ? token : undefined
  }
}
