import { Transform } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, Matches, Min } from "class-validator";
import { LoaiMaGiamGia } from "../../../common/enums/loai-ma-giam-gia.enum";

export class TaoMaGiamGiaDTO {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    @Matches(/^[A-Z0-9]{3,30}$/, { message: 'Mã chỉ gồm chữ và số, từ 3 đến 30 ký tự' })
    ma: string

    @IsEnum(LoaiMaGiamGia)
    loai: LoaiMaGiamGia

    @IsInt()
    @Min(1)
    giaTri: number

    @IsInt()
    @Min(0)
    donToiThieu: number

    @Transform(({ value }) => (value === '' ? null : value))
    @IsOptional()
    @IsDateString()
    ngayHetHan?: string | null

    @IsOptional()
    @IsBoolean()
    hoatDong?: boolean
}