import { parseBooleanConfig } from '@app/core/utils/config';

export default () => ({
  app: {
    httpPort: parseInt(process.env.HTTP_PORT, 10) || 5000,
  },
  logger: {
    level: process.env.LOG_LEVEL,
    useJsonFormat: parseBooleanConfig(process.env.LOG_USE_JSON),
  },
  httpInterceptor: {
    logResponse: parseBooleanConfig(process.env.HTTP_INTERCEPTOR_LOG_RESPONSE),
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    pwd: process.env.REDIS_PWD,
    db: parseInt(process.env.REDIS_DB_INDEX, 10) || 0,
  },

  // microservice
  iam: {
    grpcEndpoint: process.env.IAM_GRPC_ENDPOINT,
  },
  umaster: {
    grpcEndpoint: process.env.UMASTER_GRPC_ENDPOINT,
  },
  emaster: {
    grpcEndpoint: process.env.EMASTER_GRPC_ENDPOINT,
  },
  grpcConfig: {
    maxRetries: parseInt(process.env.GRPC_MAX_RETRIES, 10),
  },
});
