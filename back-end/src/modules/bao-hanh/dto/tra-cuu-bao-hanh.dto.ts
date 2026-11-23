import { IsOptional } from 'class-validator';
import { LaMaDon } from '../../../common/validators/la-ma-don';
import { LaSoSerial } from '../../../common/validators/la-so-serial';

export class TraCuuBaoHanhDTO {
    @IsOptional()
    @LaSoSerial()
    soSerial?: string

    @IsOptional()
    @LaMaDon()
    maDon?: string
}
