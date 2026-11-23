import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const caiTrim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class LuuDiaChiDTO {
    @IsString()
    @Transform(caiTrim)
    @IsNotEmpty({ message: 'Vui lòng nhập tên người nhận' })
    @MaxLength(100)
    tenNguoiNhan: string

    @Matches(/^[0-9]{9,11}$/, { message: 'Số điện thoại không hợp lệ' })
    soDienThoai: string

    @IsString()
    @Transform(caiTrim)
    @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ' })
    @MaxLength(255)
    diaChi: string

    @IsOptional()
    @IsBoolean()
    macDinh?: boolean
}

export class CapNhatDiaChiDTO extends PartialType(LuuDiaChiDTO) { }
