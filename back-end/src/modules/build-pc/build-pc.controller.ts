import { Controller, Get, Query } from '@nestjs/common';
import { BuildPcService } from './build-pc.service';
import { DeXuatBuildPcDTO } from './dto/de-xuat-build-pc.dto';

@Controller('build-pc')
export class BuildPcController {
  constructor(private readonly buildPcService: BuildPcService) { }

  @Get('de-xuat')
  deXuat(@Query() dto: DeXuatBuildPcDTO) {
    return this.buildPcService.deXuat(dto.nganSach, dto.nhuCau)
  }
}
