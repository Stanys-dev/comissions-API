import { Body, Controller, Post } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { GetDto } from './static/commission.dto';
import { ResponseSerializer } from './static/commission.serializer';

@Controller('commission')
export class CommissionController {
  constructor(private readonly comissionService: CommissionService) {}
  @Post('/')
  async getComissionPrice(@Body() dto: GetDto): Promise<ResponseSerializer> {
    return this.comissionService.getComissionPrice(dto);
  }
}
