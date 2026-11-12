import { PartialType } from '@nestjs/mapped-types';
import { CreateQuanTriDto } from './create-quan-tri.dto';

export class UpdateQuanTriDto extends PartialType(CreateQuanTriDto) {}
