import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PhanTrangDTO } from '../../../common/dto/phan-trang.dto';
import { TrangThaiBaoHanh } from '../../../common/enums/trang-thai-bao-hanh.enum';

export class LocBaoHanhDTO extends PhanTrangDTO {
    @IsOptional()
    @IsEnum(TrangThaiBaoHanh)
    trangThai?: TrangThaiBaoHanh

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    query?: string
}
