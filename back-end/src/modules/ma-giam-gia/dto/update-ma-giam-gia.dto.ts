import { PartialType } from '@nestjs/mapped-types';
import { CreateMaGiamGiaDto } from './create-ma-giam-gia.dto';

export class UpdateMaGiamGiaDto extends PartialType(CreateMaGiamGiaDto) {}
