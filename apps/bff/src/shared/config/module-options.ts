import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: ['.env', 'apps/bff/.env.local'],
  load: [configuration],
  isGlobal: true,
  validationSchema: Joi.object({
    // port config
    HTTP_PORT: Joi.number().required(),
    LOG_LEVEL: Joi.string()
      .valid('debug', 'info', 'error', 'warning', 'critical')
      .default('debug'),
  }),
};
