import { IsBoolean, IsOptional } from 'class-validator';
import { LaSoSerial } from '../../../common/validators/la-so-serial';

export class DoiSerialDTO {
    @LaSoSerial()
    soSerialCu: string

    @LaSoSerial()
    soSerialMoi: string

    @IsOptional()
    @IsBoolean()
    danhDauLoi?: boolean
}
