import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: ['.env', 'apps/umaster/.env.local'],
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

    // Mongo
    MONGO_URI: Joi.string().required(),

    // GCS
    GCS_BUCKET: Joi.string().required(),
    GCS_SERVICE_ACCOUNT: Joi.string().required(),
  }),
};
