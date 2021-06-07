import { Module } from '@nestjs/common';
import { CommisionModule } from './commission/commission.module';

@Module({
  imports: [CommisionModule],
})
export class AppModule {}
