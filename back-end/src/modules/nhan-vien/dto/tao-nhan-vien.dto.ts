import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { ViTri } from "../../../common/enums/vi-tri.enum";

export class TaoNhanVienDTO {
    @IsEmail()
    email: string

    @IsString()
    @Length(6, 100)
    password: string

    @IsString()
    @IsNotEmpty()
    hoTen: string

    @Matches(/^[0-9]{9,11}$/, { message: 'Số điện thoại không hợp lệ' })
    soDienThoai: string

    @IsEnum(ViTri)
    viTri: ViTri
}