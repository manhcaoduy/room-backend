import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@app/core/dal/repositories/base-repository';
import { ActionEntity } from './action.entity';
import { Action } from './action.schema';

@Injectable()
export class ActionRepository extends BaseRepository<ActionEntity> {
  constructor() {
    super(Action, ActionEntity);
  }
}
