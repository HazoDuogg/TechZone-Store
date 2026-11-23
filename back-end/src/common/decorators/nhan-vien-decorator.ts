import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { VaiTroGuard } from '../guards/vai-tro.guard';
import { CanVaiTro, CanViTri } from './vai-tro.decorator';
import { VaiTro } from '../enums/vai-tro.enum';
import { ViTri } from '../enums/vi-tri.enum';

export const ChiNhanVien = (...cacViTri: ViTri[]) => applyDecorators(
    UseGuards(JwtAuthGuard, VaiTroGuard),
    CanVaiTro([VaiTro.NHAN_VIEN, VaiTro.ADMIN]),
    CanViTri(cacViTri),
)
