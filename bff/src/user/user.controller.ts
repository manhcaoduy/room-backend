import { Controller, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { UMasterGrpcServiceUserService } from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';

@Controller('v1/auth') // just use auth, since FE have already integration with the previous endpoint.
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('User')
export class UserController {
  private logger: LoggerService;

  constructor(
    @Inject(UMasterGrpcServiceUserService)
    private readonly userService: UserServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(
      `Gateway${UserController.name}`,
    );
  }
}
