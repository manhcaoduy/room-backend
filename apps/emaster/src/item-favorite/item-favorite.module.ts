import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { ItemFavoriteController } from './item-favorite.controller';
import { ItemFavoriteService } from './item-favorite.service';

@Module({
  imports: [SharedModule],
  controllers: [ItemFavoriteController],
  providers: [ItemFavoriteService],
})
export class ItemFavoriteModule {}
