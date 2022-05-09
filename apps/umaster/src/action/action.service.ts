import { Injectable } from '@nestjs/common';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { ActionEntity, ActionRepository } from '../shared/repositories/action';
import { ActionType } from '@app/microservice/proto/shared/Action/v1/Action';

@Injectable()
export class ActionService {
  private logger: LoggerService;

  constructor(
    private actionRepository: ActionRepository,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = loggerFactory.createLogger(ActionService.name);
  }

  async createAction(request: {
    userId: string;
    itemId: string;
    type: ActionType;
    txHash: string;
    itemName: string;
  }): Promise<ActionEntity> {
    const { userId, itemId, txHash, type, itemName } = request;
    const action = await this.actionRepository.create({
      userId,
      itemId,
      txHash,
      type,
      itemName,
    });
    return action;
  }

  async getActions(request: { userId: string }): Promise<ActionEntity[]> {
    const { userId } = request;
    const actions = await this.actionRepository.find({ userId });
    return actions;
  }
}
