import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggerFactoryModule } from '@app/core/utils/logger/logger-factory.module';

import { GrpcLoggingModule } from '@app/microservice/grpc/grpc-logging/grpc-logging.module';

import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { SharedModule } from './shared/shared.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    SharedModule,
    HealthCheckModule,
    ItemModule,
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
