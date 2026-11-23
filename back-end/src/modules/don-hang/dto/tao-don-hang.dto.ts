import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, ValidateNested } from 'class-validator';

export class DonDatHangDTO {
    @IsInt()
    @Min(1)
    idSanPham: number

    @IsInt()
    @Min(1)
    @Max(100)
    soLuong: number
}

export class TamTinhDTO {
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() || undefined : value))
    @Matches(/^[A-Z0-9]{3,30}$/, { message: 'Mã giảm giá chỉ gồm chữ và số, từ 3 đến 30 ký tự' })
    maGiamGia?: string

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => DonDatHangDTO)
    cacDong: DonDatHangDTO[]
}

export class DatHangDTO extends TamTinhDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    tenNguoiNhan: string

    @Matches(/^[0-9]{9,11}$/, { message: 'Số điện thoại không hợp lệ' })
    soDienThoai: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    diaChi: string
}
