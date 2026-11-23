import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

export const MAU_MA_DON = /^TZ[0-9A-F]{8}$/

export const LaMaDon = () => applyDecorators(
    Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)),
    Matches(MAU_MA_DON, { message: 'Mã đơn hàng phải có dạng TZ + 8 ký tự, ví dụ TZ1A2B3C4D' }),
)
