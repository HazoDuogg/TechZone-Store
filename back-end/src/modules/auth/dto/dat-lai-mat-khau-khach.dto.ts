import { IsEmail, IsString, Length, Matches } from "class-validator"

export class DatLaiMatKhauKhachDTO {
    @IsEmail()
    email: string

    @Matches(/^[0-9]{6}$/, { message: 'Mã gồm 6 số' })
    ma: string

    @IsString()
    @Length(6, 100)
    matKhauMoi: string
}