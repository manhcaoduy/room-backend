import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: ['.env', 'apps/iam/.env.local'],
  load: [configuration],
  isGlobal: true,
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .valid('local', 'dev', 'stag', 'prod', 'test')
      .default('dev'),
    LOG_LEVEL: Joi.string()
      .valid('debug', 'info', 'error', 'warning', 'critical')
      .default('debug'),

    // port config
    HTTP_PORT: Joi.number().required(),
    GRPC_PORT: Joi.number().required(),

    //Redis
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PWD: Joi.string().optional(),
    REDIS_DB_INDEX: Joi.string().required(),

    // Mongo
    MONGO_URI: Joi.string().required(),
  }),
};
