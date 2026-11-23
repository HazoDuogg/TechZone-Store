import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { LaSoSerial } from '../../../common/validators/la-so-serial';

const chuoiRongThanhNull = ({ value }: { value: unknown }) => (typeof value === 'string' && value.trim() === '' ? null : value)

export class SanPhamMoiDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    ten: string

    @IsOptional()
    @Transform(chuoiRongThanhNull)
    @IsString()
    @MaxLength(100)
    thuongHieu?: string | null

    @IsInt()
    @Min(1)
    idDanhMuc: number
}

export class DongNhapKhoDTO {
    @IsOptional()
    @IsInt()
    @Min(1)
    idSanPham?: number

    @IsOptional()
    @ValidateNested()
    @Type(() => SanPhamMoiDTO)
    sanPhamMoi?: SanPhamMoiDTO

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

export class NhapKhoDTO {
    @IsOptional()
    @Transform(chuoiRongThanhNull)
    @IsString()
    @MaxLength(255)
    ghiChu?: string | null

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @ValidateNested({ each: true })
    @Type(() => DongNhapKhoDTO)
    cacDong: DongNhapKhoDTO[]
}
