import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';

@Module({
  imports: [SharedModule],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
