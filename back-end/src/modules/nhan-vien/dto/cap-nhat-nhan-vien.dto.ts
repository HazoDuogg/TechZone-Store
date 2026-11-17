import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";
import { TaoNhanVienDTO } from "./tao-nhan-vien.dto";
import { TrangThaiNhanVien } from "../../../common/enums/trang-thai-nhan-vien.enum";

export class CapNhanNhanVienDTO extends PartialType(OmitType(TaoNhanVienDTO, ['password'])) {
    @IsOptional()
    @IsEnum(TrangThaiNhanVien)
    trangThai?: TrangThaiNhanVien
}