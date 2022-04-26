import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [SharedModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
