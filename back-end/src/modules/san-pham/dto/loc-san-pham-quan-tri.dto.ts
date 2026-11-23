import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class LocSanPhamQuanTriDTO {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    query?: string

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    danhMuc?: number

    @IsOptional()
    @IsIn(['cho_bo_sung', 'dang_ban', 'ngung_ban'])
    trangThai?: 'cho_bo_sung' | 'dang_ban' | 'ngung_ban'

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    trang?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
    soLuong?: number
}
