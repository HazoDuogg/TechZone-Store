import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { ViTri } from "../../../common/enums/vi-tri.enum";

export class TaoNhanVienDTO {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail()
    email: string

    @IsString()
    @Length(6, 100)
    password: string

    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    hoTen: string

    @Matches(/^[0-9]{9,11}$/, { message: 'Số điện thoại không hợp lệ' })
    soDienThoai: string

    @IsEnum(ViTri)
    viTri: ViTri
}