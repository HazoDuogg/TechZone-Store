import { IsEnum, IsOptional } from 'class-validator';
import { PhanTrangDTO } from '../../../common/dto/phan-trang.dto';
import { TrangThaiDonHang } from '../../../common/enums/trang-thai-don-hang.enum';

export class LocDonCuaToiDTO extends PhanTrangDTO {
    @IsOptional()
    @IsEnum(TrangThaiDonHang)
    trangThai?: TrangThaiDonHang
}
