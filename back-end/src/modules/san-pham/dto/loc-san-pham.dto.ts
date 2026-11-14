import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class LocSanPhamDTO {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    danhMuc?: number

    @IsOptional() @IsString() @MaxLength(100)
    query?: string

    @IsOptional() @IsString() @MaxLength(100)
    thuongHieu?: string

    @IsOptional() @Type(() => Number) @IsInt() @Min(0)
    giaTu?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(0)
    giaDen?: number

    @IsOptional() @Transform(({ value }) => value === 'true' || value === true) @IsBoolean()
    conHang?: boolean

    @IsOptional() @IsIn(['moi', 'gia-tang', 'gia-giam'])
    sapXep?: 'moi' | 'gia-tang' | 'gia-giam'

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    trang?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
    soLuong?: number
}
