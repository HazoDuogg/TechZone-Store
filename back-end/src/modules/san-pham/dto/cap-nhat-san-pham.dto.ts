import { PartialType } from '@nestjs/mapped-types';
import { TaoSanPhamDTO } from './tao-san-pham.dto';

export class CapNhatSanPhamDTO extends PartialType(TaoSanPhamDTO) { }
