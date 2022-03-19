import { parseBooleanConfig } from '@app/core/utils/config';

export default () => ({
  app: {
    httpPort: parseInt(process.env.HTTP_PORT, 10),
    grpcPort: parseInt(process.env.GRPC_PORT, 10),
    env: process.env.APP_ENV,
  },
  logger: {
    level: process.env.LOG_LEVEL,
    useJsonFormat: parseBooleanConfig(process.env.LOG_USE_JSON),
  },
  grpcInterceptor: {
    logResponse: parseBooleanConfig(process.env.GRPC_INTERCEPTOR_LOG_RESPONSE),
  },
  mongo: {
    uri: process.env.MONGO_URI,
    debug: parseBooleanConfig(process.env.MONGO_DEBUG),
  },
  gcs: {
    bucketName: process.env.GCS_BUCKET,
    serviceAccount: process.env.GCS_SERVICE_ACCOUNT,
  },
});
