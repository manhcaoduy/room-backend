import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { ItemHistoryController } from './item-history.controller';
import { ItemHistoryService } from './item-history.service';

@Module({
  imports: [SharedModule],
  controllers: [ItemHistoryController],
  providers: [ItemHistoryService],
})
export class ItemHistoryModule {}
