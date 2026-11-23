import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TrangThaiBaoHanh } from '../../../common/enums/trang-thai-bao-hanh.enum';

export class CapNhatBaoHanhDTO {
    @IsEnum(TrangThaiBaoHanh)
    trangThai: TrangThaiBaoHanh

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @MaxLength(500)
    ketQua?: string
}
