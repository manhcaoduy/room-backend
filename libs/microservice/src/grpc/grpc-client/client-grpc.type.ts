import { GrpcOptions } from '@nestjs/microservices';

export interface ClientGrpcStaticOptions {
  microservice: string;
  usingHttpError?: boolean;
}

export interface ClientGrpcAsyncOptions {
  options: GrpcOptions['options'];
  maxRetries?: number;
}
