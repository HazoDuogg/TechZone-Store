import { PartialType } from "@nestjs/mapped-types";
import { TaoDanhMucDTO } from "./tao-danh-muc.dto";

export class CapNhatDanhMucDTO extends PartialType(TaoDanhMucDTO) { }