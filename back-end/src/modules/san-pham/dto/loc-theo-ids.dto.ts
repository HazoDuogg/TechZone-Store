import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, Min } from 'class-validator';

export class LocTheoIdsDTO {
    @Transform(({ value }) => (typeof value === 'string' ? value.split(',').filter(Boolean).map(Number) : value))
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @IsInt({ each: true })
    @Min(1, { each: true })
    ids: number[]
}
