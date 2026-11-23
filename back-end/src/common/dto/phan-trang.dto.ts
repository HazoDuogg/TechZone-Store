import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PhanTrangDTO {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    trang?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
    soLuong?: number
}
