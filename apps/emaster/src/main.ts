import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';

import { AppModule } from './app.module';
import { EmasterGrpcOptions } from '@app/microservice/grpc/grpc-options/emaster.option';

async function bootstrap() {
  //
  const app = await NestFactory.create(AppModule);

  const logger = app
    .get(LoggerFactoryService)
    .createLogger(`Emaster${AppModule.name}`);
  app.useLogger(logger);

  const configService = app.get(ConfigService);

  //
  const grpcPort = configService.get<number>('app.grpcPort');

  const grpcOptions = Object.assign({}, EmasterGrpcOptions, {
    url: `0.0.0.0:${grpcPort}`,
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: grpcOptions,
  });

  await app.startAllMicroservices();

  const port = configService.get<number>('app.httpPort');
  await app.listen(port);
  logger.info(
    `Application is running on: ${await app.getUrl()}, grpcPort: ${grpcPort}`,
  );
}

bootstrap();
