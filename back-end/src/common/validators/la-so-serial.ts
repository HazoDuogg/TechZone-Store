import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

export const MAU_SO_SERIAL = /^SN-[A-Z0-9]{2,12}-[0-9]{4,6}$/

const chuanHoa = (giaTri: unknown): unknown => (Array.isArray(giaTri) ? giaTri.map(chuanHoa) : typeof giaTri === 'string' ? giaTri.trim().toUpperCase() : giaTri)

export const LaSoSerial = (moiPhanTu = false) => applyDecorators(
    Transform(({ value }) => chuanHoa(value)),
    Matches(MAU_SO_SERIAL, { each: moiPhanTu, message: 'Số serial phải có dạng SN-MÃ-SỐ, ví dụ SN-CPU5600-0001' }),
)
