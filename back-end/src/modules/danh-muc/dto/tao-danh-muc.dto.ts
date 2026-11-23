import { Transform } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

const chuoiRong = ({ value }: { value: unknown }) => (
    typeof value === 'string' && value.trim() === ''
        ? null
        : value
)

export class TaoDanhMucDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    ten: string

    @IsOptional()
    @Transform(chuoiRong)
    @IsString()
    @MaxLength(255)
    moTa?: string

    @IsOptional()
    @Transform(chuoiRong)
    @IsString()
    @MaxLength(255)
    anhDaiDien?: string | null
}