import { IsEnum } from 'class-validator';
import { TrangThaiDonHang } from '../../../common/enums/trang-thai-don-hang.enum';

export class DoiTrangThaiDonDTO {
    @IsEnum(TrangThaiDonHang)
    trangThai: TrangThaiDonHang
}
