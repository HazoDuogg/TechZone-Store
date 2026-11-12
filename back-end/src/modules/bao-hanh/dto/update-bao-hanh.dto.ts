import { PartialType } from '@nestjs/mapped-types';
import { CreateBaoHanhDto } from './create-bao-hanh.dto';

export class UpdateBaoHanhDto extends PartialType(CreateBaoHanhDto) {}
