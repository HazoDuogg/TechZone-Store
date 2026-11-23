import { Module } from '@nestjs/common';
import { TaiAnhController } from './tai-anh.controller';

@Module({
    controllers: [TaiAnhController],
})
export class TaiAnhModule { }
