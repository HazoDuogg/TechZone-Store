import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { LoaiPhieuKho } from '../../../common/enums/loai-phieu-kho.enum';

export class LocPhieuKhoDTO {
    @IsOptional()
    @IsEnum(LoaiPhieuKho)
    loai?: LoaiPhieuKho

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    trang?: number

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
    soLuong?: number
}
