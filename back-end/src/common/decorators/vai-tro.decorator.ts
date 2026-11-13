import { Reflector } from '@nestjs/core';
import { VaiTro } from '../enums/vai-tro.enum';

export const CanVaiTro = Reflector.createDecorator<VaiTro[]>();
