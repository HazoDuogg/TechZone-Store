import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PhanTrangDTO } from '../../../common/dto/phan-trang.dto';

export class LocKhachHangDTO extends PhanTrangDTO {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    query?: string
}
