import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsIn, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

const MAU_DUONG_DAN_ANH = /^(uploads\/[a-f0-9]{24}\.(jpg|png|webp)|san-pham\/[a-z0-9/-]+)$/

const chuoiRongThanhNull = ({ value }: { value: unknown }) => (typeof value === 'string' && value.trim() === '' ? null : value)

export class TaoSanPhamDTO {
    @IsInt()
    @Min(1)
    idDanhMuc: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    ten: string

    @IsOptional()
    @Transform(chuoiRongThanhNull)
    @IsString()
    @MaxLength(100)
    thuongHieu?: string | null

    @IsInt()
    @Min(0)
    gia: number

    @IsOptional()
    @IsInt()
    @Min(1)
    giaNiemYet?: number | null

    @IsOptional()
    @Transform(chuoiRongThanhNull)
    @IsString()
    @MaxLength(5000)
    moTa?: string | null

    @IsOptional()
    @IsObject()
    @Transform(({ value }) =>
        value && typeof value === 'object' && !Array.isArray(value)
            ? Object.fromEntries(Object.entries(value).slice(0, 50).map(([khoa, giaTri]) => [khoa, String(giaTri)]))
            : value,
    )
    thongSo?: Record<string, string> | null

    @IsInt()
    @Min(0)
    @Max(255)
    soThangBaoHanh: number

    @IsIn(['cho_bo_sung', 'dang_ban', 'ngung_ban'])
    trangThai: 'cho_bo_sung' | 'dang_ban' | 'ngung_ban'

    @IsArray()
    @ArrayMaxSize(8)
    @Matches(MAU_DUONG_DAN_ANH, { each: true, message: 'Đường dẫn ảnh không hợp lệ' })
    anh: string[]
}
