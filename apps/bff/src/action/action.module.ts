import { SharedModule } from '../shared/shared.modules';
import { Module } from '@nestjs/common';
import {
  UMasterGrpcService,
  UmasterGrpcServiceActionService,
} from '@app/microservice/constants/microservice';
import { GrpcClient } from '@app/microservice/grpc/grpc-client';
import { ActionController } from './action.controller';
import { ActionServiceClient } from '@app/microservice/proto/umaster/action/v1/action';

@Module({
  imports: [SharedModule],
  controllers: [ActionController],
  providers: [
    {
      provide: UmasterGrpcServiceActionService,
      useFactory: (client: GrpcClient) => {
        return client.getService<ActionServiceClient>(
          UmasterGrpcServiceActionService,
        );
      },
      inject: [UMasterGrpcService],
    },
  ],
})
export class ActionModule {}
