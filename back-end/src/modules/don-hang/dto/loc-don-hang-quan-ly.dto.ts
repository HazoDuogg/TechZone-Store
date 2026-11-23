import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { TrangThaiDonHang } from '../../../common/enums/trang-thai-don-hang.enum';

export class LocDonHangQuanLyDTO {
    @IsOptional()
    @IsEnum(TrangThaiDonHang)
    trangThai?: TrangThaiDonHang

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    query?: string

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    trang?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
    soLuong?: number
}
