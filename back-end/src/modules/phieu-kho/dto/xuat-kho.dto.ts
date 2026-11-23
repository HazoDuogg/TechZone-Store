import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { LyDoXuatKho } from '../../../common/enums/ly-do-xuat-kho.enum';
import { LaSoSerial } from '../../../common/validators/la-so-serial';

export class DongXuatKhoDTO {
    @IsInt()
    @Min(1)
    idSanPham: number

    @IsInt()
    @Min(1)
    @Max(500)
    soLuong: number

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(500)
    @LaSoSerial(true)
    cacSerial?: string[]
}

export class XuatKhoDTO {
    @IsEnum(LyDoXuatKho)
    lyDo: LyDoXuatKho

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? null : value))
    @IsString()
    @MaxLength(200)
    ghiChu?: string | null

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @ValidateNested({ each: true })
    @Type(() => DongXuatKhoDTO)
    cacDong: DongXuatKhoDTO[]
}
