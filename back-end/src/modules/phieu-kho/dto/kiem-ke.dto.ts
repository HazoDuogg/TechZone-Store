import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';

export class DongKiemKeDTO {
    @IsInt()
    @Min(1)
    idSanPham: number

    @IsInt()
    @Min(0)
    @Max(100000)
    tonThucTe: number
}

export class KiemKeDTO {
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? null : value))
    @IsString()
    @MaxLength(255)
    ghiChu?: string | null

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(200)
    @ValidateNested({ each: true })
    @Type(() => DongKiemKeDTO)
    cacDong: DongKiemKeDTO[]
}
