import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CanVaiTro } from '../decorators/vai-tro.decorator';
import { YeuCauDaXacThuc } from './jwt-auth.guard';

@Injectable()
export class VaiTroGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const vaiTroDuocPhep = this.reflector.getAllAndOverride(CanVaiTro, [context.getHandler(), context.getClass()])
    if (!vaiTroDuocPhep || vaiTroDuocPhep.length === 0) {
      return true
    }

    const yeuCau = context.switchToHttp().getRequest<YeuCauDaXacThuc>()
    const vaiTro = yeuCau.user?.vaiTro

    if (!vaiTro || !vaiTroDuocPhep.includes(vaiTro)) {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này')
    }
    return true
  }
}
