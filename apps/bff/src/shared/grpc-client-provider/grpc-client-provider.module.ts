import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  IamGrpcService,
  UMasterGrpcService,
} from '@app/microservice/constants/microservice';
import { ClientGrpcModule } from '@app/microservice/grpc/grpc-client/client-grpc.module';
import { IamGrpcOptions } from '@app/microservice/grpc/grpc-options/iam.option';
import { UMasterGrpcOptions } from '@app/microservice/grpc/grpc-options/umaster.option';

@Module({
  imports: [
    ClientGrpcModule.forRootAsync(
      {
        microservice: IamGrpcService,
        usingHttpError: true,
      },
      {
        useFactory: (configService: ConfigService) => {
          const grpcEndpoint = configService.get<string>('iam.grpcEndpoint');
          const maxRetries = configService.get<number>('grpcConfig.maxRetries');
          const grpcOptions = Object.assign({}, IamGrpcOptions, {
            url: grpcEndpoint,
          });
          return {
            options: grpcOptions,
            maxRetries,
          };
        },
        inject: [ConfigService],
      },
    ),
    ClientGrpcModule.forRootAsync(
      {
        microservice: UMasterGrpcService,
        usingHttpError: true,
      },
      {
        useFactory: (configService: ConfigService) => {
          const grpcEndpoint = configService.get<string>(
            'umaster.grpcEndpoint',
          );
          const maxRetries = configService.get<number>('grpcConfig.maxRetries');
          const grpcOptions = Object.assign({}, UMasterGrpcOptions, {
            url: grpcEndpoint,
          });
          return {
            options: grpcOptions,
            maxRetries,
          };
        },
        inject: [ConfigService],
      },
    ),
  ],
  exports: [ClientGrpcModule],
})
export class GrpcClientProviderModule {}
