import { Transform } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

export class CapNhatGhiChuDTO {
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @MaxLength(255, { message: 'Ghi chú tối đa 255 ký tự' })
    ghiChu: string
}
