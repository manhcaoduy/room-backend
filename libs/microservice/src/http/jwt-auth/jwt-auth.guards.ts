import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { HttpUnauthorizedException } from '@app/core/framework/exceptions/http-exception';
import { extractTokenFromAuthorization } from '@app/core/utils/jwt';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { IamGrpcServiceAuthService } from '@app/microservice/constants/microservice';
import { AuthServiceClient } from '@app/microservice/proto/iam/auth/v1/auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger: LoggerService;

  constructor(
    @Inject(IamGrpcServiceAuthService)
    private readonly authService: AuthServiceClient,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(JwtAuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization)
      throw new HttpUnauthorizedException('Access token is not set');

    const accessToken = extractTokenFromAuthorization(authorization);
    if (!accessToken)
      throw new HttpUnauthorizedException('Access token is not set');

    const req = {
      accessToken,
    };
    const claims = await lastValueFrom(this.authService.verifyToken(req));
    if (claims) {
      request.user = claims;
    }
    return true;
  }
}
