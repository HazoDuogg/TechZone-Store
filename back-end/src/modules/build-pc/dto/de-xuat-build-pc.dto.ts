import { Type } from 'class-transformer';
import { IsEnum, IsInt, Max, Min } from 'class-validator';

export enum NhuCauBuildPc {
    CHOI_GAME = 'choi_game',
    DO_HOA = 'do_hoa',
    VAN_PHONG = 'van_phong',
}

export class DeXuatBuildPcDTO {
    @Type(() => Number)
    @IsInt()
    @Min(5_000_000, { message: 'Ngân sách tối thiểu là 5.000.000đ' })
    @Max(200_000_000, { message: 'Ngân sách tối đa là 200.000.000đ' })
    nganSach: number

    @IsEnum(NhuCauBuildPc, { message: 'Nhu cầu phải là choi_game, do_hoa hoặc van_phong' })
    nhuCau: NhuCauBuildPc
}
