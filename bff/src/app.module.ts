import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LoggerFactoryModule } from '@app/core/utils/logger/logger-factory.module';
import { SharedModules } from './shared/shared.modules';
import { HealthCheckModule } from './shared/health/healthcheck.module';

@Module({
  imports: [
    SharedModules,
    HealthCheckModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
