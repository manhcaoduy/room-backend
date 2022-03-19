import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app
    .get(LoggerFactoryService)
    .createLogger(`Gateway${AppModule.name}`);
  app.useLogger(logger);
  //
  // const configService: ConfigService = app.get(ConfigService);
  //
  // app.setGlobalPrefix('api', {
  //   exclude: ['metrics', '/health/live', '/health/readiness'],
  // });
  // app.use(RequestIdMiddleware);
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(
  //     new ResponseTransformerInterceptor(['/metrics', '/api/v1/webhook/photon']),
  // );
  //
  // const httpLoggingInterceptor = app.get(HttpLoggingInterceptor);
  // app.useGlobalInterceptors(httpLoggingInterceptor);
  //
  // app.useGlobalPipes(
  //     new ValidationPipe({
  //       transform: true,
  //       whitelist: true,
  //       // forbidNonWhitelisted: true,
  //       skipMissingProperties: true,
  //       exceptionFactory: (errors: ValidationError[]) => {
  //         return resolveValidationError(errors);
  //       },
  //     }),
  // );
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors();

  const port = configService.get<number>('app.httpPort');
  await app.listen(port);
  logger.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
