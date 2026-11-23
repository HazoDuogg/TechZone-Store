import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const caiTrim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class CapNhatHoSoDTO {
    @IsOptional()
    @IsString()
    @Transform(caiTrim)
    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    @MaxLength(100)
    hoTen?: string

    @IsOptional()
    @Matches(/^[0-9]{9,11}$/, { message: 'Số điện thoại không hợp lệ' })
    soDienThoai?: string
}
