import { Module } from '@nestjs/common';
import { BuildPcController } from './build-pc.controller';
import { BuildPcService } from './build-pc.service';

@Module({
  controllers: [BuildPcController],
  providers: [BuildPcService],
})
export class BuildPcModule { }
