import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class DangKyDTO {
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
}