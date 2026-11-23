import { Controller, Get, Query } from '@nestjs/common';
import { BaoCaoService } from './bao-cao.service';
import { LocBaoCaoDTO } from './dto/loc-bao-cao.dto';
import { ChiAdmin } from '../../common/decorators/admin-decorator';

@Controller('bao-cao')
@ChiAdmin()
export class BaoCaoController {
  constructor(private readonly baoCaoService: BaoCaoService) { }

  @Get('tong-quan')
  tongQuan(@Query() loc: LocBaoCaoDTO) {
    return this.baoCaoService.tongQuan(loc.soThang ?? 6)
  }
}
