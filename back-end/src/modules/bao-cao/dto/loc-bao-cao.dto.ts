import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class LocBaoCaoDTO {
    @IsOptional()
    @Type(() => Number)
    @IsIn([6, 12], { message: 'Chỉ xem được báo cáo 6 hoặc 12 tháng' })
    soThang?: 6 | 12
}
