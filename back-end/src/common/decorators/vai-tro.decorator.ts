import { Reflector } from '@nestjs/core';
import { VaiTro } from '../enums/vai-tro.enum';
import { ViTri } from '../enums/vi-tri.enum';

export const CanVaiTro = Reflector.createDecorator<VaiTro[]>();

export const CanViTri = Reflector.createDecorator<ViTri[]>();
