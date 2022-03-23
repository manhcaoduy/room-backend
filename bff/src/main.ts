import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { SWAGGER_ACCESS_TOKEN_KEY } from '@app/microservice/http/constants';
import { RequestIdMiddleware } from '@app/microservice/http/request-id/request-id.middleware';
import { resolveValidationError } from '@app/microservice/http/exception-factory/exception-factory.resolver';
import { HttpExceptionFilter } from '@app/core/framework/exceptions/http-exception';
import { HttpLoggingInterceptor } from '@app/microservice/http/logging/http-logging-interceptor.service';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { ConfigService } from '@nestjs/config';

function setupSwagger(app: any) {
  // swagger
  const config = new DocumentBuilder()
    .setTitle('Restful API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      SWAGGER_ACCESS_TOKEN_KEY,
    )
    .setExternalDoc('Postman Collection', '/swagger-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      cacheControl: false,
      docExpansion: 'none',
      etag: false,
    },
    customSiteTitle: 'Restful API',
  };
  SwaggerModule.setup('swagger', app, document, customOptions);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app
    .get(LoggerFactoryService)
    .createLogger(`Gateway${AppModule.name}`);
  app.useLogger(logger);

  app.setGlobalPrefix('api', {
    exclude: ['metrics', '/health/live', '/health/readiness'],
  });
  app.use(RequestIdMiddleware);
  app.useGlobalFilters(new HttpExceptionFilter());

  const httpLoggingInterceptor = app.get(HttpLoggingInterceptor);
  app.useGlobalInterceptors(httpLoggingInterceptor);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return resolveValidationError(errors);
      },
    }),
  );
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors();

  setupSwagger(app);

  const port = configService.get<number>('app.httpPort');
  await app.listen(port);
  logger.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
