import { Controller, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import {
  IamGrpcServiceAuthService,
  UMasterGrpcServiceUserService,
} from '@app/microservice/constants/microservice';
import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { AuthServiceClient } from '@app/microservice/proto/iam/auth/v1/auth';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';

@Controller('v1/auth')
@ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY)
@ApiTags('Auth')
export class AuthController {
  private logger: LoggerService;

  constructor(
    @Inject(IamGrpcServiceAuthService)
    private readonly authService: AuthServiceClient,
    @Inject(UMasterGrpcServiceUserService)
    private readonly userService: UserServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(
      `Gateway${AuthController.name}`,
    );
  }

  // @Post('login')
  // @ApiResponse({
  //   status: 200,
  //   type: LoginResponse,
  //   description: '{ status: 1: data: {as type below} }',
  // })
  // async login(@Body() req: LoginRequest): Promise<LoginResponse> {
  //   const { isNewUser } = await lastValueFrom(
  //     this.authService.login(req),
  //   );
  //
  //   return {
  //     result: true,
  //     isNewUser,
  //   };
  // }
}
