import { PartialType } from "@nestjs/mapped-types";
import { TaoMaGiamGiaDTO } from "./tao-ma-giam-gia.dto";

export class CapNhatMaGiamGiaDTO extends PartialType(TaoMaGiamGiaDTO) { }