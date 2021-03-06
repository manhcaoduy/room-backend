import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LoggerFactoryModule } from '@app/core/utils/logger/logger-factory.module';
import { SharedModule } from './shared/shared.modules';
import { HealthCheckModule } from './shared/health/healthcheck.module';
import { HttpLoggingModule } from '@app/microservice/http/logging/http-logging.module';
import { AuthModule } from './auth/auth.module';
import { UserWalletModule } from './user-wallet/user-wallet.module';
import { ItemModule } from './item/item.module';
import { ItemFavoriteModule } from './item-favorite/item-favorite.module';
import { ActionModule } from './action/action.module';
import { ItemHistoryModule } from './item-history/item-history.module';

@Module({
  imports: [
    SharedModule,
    HealthCheckModule,
    AuthModule,
    UserWalletModule,
    ItemModule,
    ItemFavoriteModule,
    ActionModule,
    ItemHistoryModule,
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
    HttpLoggingModule.forRootAsync(
      {
        excludedRoutePrefixes: ['metrics', 'health'],
      },
      {
        useFactory: (configService: ConfigService) => {
          return {
            logResponse: configService.get('httpInterceptor.logResponse'),
          };
        },
        inject: [ConfigService],
      },
    ),
  ],
  providers: [AppService],
})
export class AppModule {}
