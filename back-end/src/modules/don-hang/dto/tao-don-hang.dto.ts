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

export class DatHangDTO {
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

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    maGiamGia?: string

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => DonDatHangDTO)
    cacDong: DonDatHangDTO[]
}
