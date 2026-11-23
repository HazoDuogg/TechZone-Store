import { IsString, Length } from 'class-validator';

export class DoiMatKhauDTO {
    @IsString()
    @Length(1, 100)
    matKhauHienTai: string

    @IsString()
    @Length(6, 100, { message: 'Mật khẩu mới phải từ 6 đến 100 ký tự' })
    matKhauMoi: string
}
