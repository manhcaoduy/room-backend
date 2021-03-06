import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggerFactoryModule } from '@app/core/utils/logger/logger-factory.module';

import { GrpcLoggingModule } from '@app/microservice/grpc/grpc-logging/grpc-logging.module';

import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { ActionModule } from './action/action.module';

@Module({
  imports: [
    SharedModule,
    HealthCheckModule,
    UserModule,
    ActionModule,
    LoggerFactoryModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const loggerConfig = configService.get('logger');
        return {
          logLevel: loggerConfig.level,
          useJsonFormat: loggerConfig.useJsonFormat,
        };
      },
      inject: [ConfigService],
    }),
    GrpcLoggingModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          logResponse: configService.get('grpcInterceptor.logResponse'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
