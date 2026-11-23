import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CanVaiTro, CanViTri } from '../decorators/vai-tro.decorator';
import { VaiTro } from '../enums/vai-tro.enum';
import { YeuCauDaXacThuc } from './jwt-auth.guard';

@Injectable()
export class VaiTroGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const noiDung = [context.getHandler(), context.getClass()]
    const vaiTroDuocPhep = this.reflector.getAllAndOverride(CanVaiTro, noiDung)
    const viTriDuocPhep = this.reflector.getAllAndOverride(CanViTri, noiDung)
    const nguoiDung = context.switchToHttp().getRequest<YeuCauDaXacThuc>().user

    if (!vaiTroDuocPhep?.length || !nguoiDung || !vaiTroDuocPhep.includes(nguoiDung.vaiTro)) {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này')
    }

    if (viTriDuocPhep?.length && nguoiDung.vaiTro === VaiTro.NHAN_VIEN && (!nguoiDung.viTri || !viTriDuocPhep.includes(nguoiDung.viTri))) {
      throw new ForbiddenException('Vị trí của bạn không có quyền thực hiện thao tác này')
    }
    return true
  }
}
