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
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    pwd: process.env.REDIS_PWD,
    db: parseInt(process.env.REDIS_DB_INDEX, 10) || 0,
  },
  mongo: {
    uri: process.env.MONGO_URI,
    debug: parseBooleanConfig(process.env.MONGO_DEBUG),
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
  },
  umaster: {
    grpcEndpoint: process.env.UMASTER_GRPC_ENDPOINT,
  },
});
