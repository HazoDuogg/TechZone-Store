import { IsOptional, Matches } from 'class-validator';
import { LaMaDon } from '../../../common/validators/la-ma-don';

const SO_DIEN_THOAI = /^[0-9]{9,11}$/

export class TraCuuDonDTO {
    @LaMaDon()
    ma: string

    @Matches(SO_DIEN_THOAI, { message: 'Số điện thoại không hợp lệ' })
    soDienThoai: string
}

export class HuyDonDTO {
    @IsOptional()
    @Matches(SO_DIEN_THOAI, { message: 'Số điện thoại không hợp lệ' })
    soDienThoai?: string
}
