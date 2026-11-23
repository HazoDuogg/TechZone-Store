import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { LaSoSerial } from '../../../common/validators/la-so-serial';

export class TiepNhanBaoHanhDTO {
    @LaSoSerial()
    soSerial: string

    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @Length(5, 500, { message: 'Mô tả lỗi phải từ 5 đến 500 ký tự' })
    moTaLoi: string
}
