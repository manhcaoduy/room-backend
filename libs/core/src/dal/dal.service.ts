import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ConnectOptions, Connection } from 'mongoose';
import * as util from 'util';

import { LoggerFactoryService } from '../utils/logger/logger-factory.service';
import { LoggerService } from '../utils/logger/logger.service';
import { DAL_SERVICE_OPTIONS, DEFAULT_OPTIONS } from './dal.constant';
import { DalServiceOptions } from './dal.options';

@Injectable()
export class DalService implements OnModuleInit {
  connection: Connection;
  debug: boolean;
  uri: string;
  private readonly logger: LoggerService;

  constructor(
    @Inject(DAL_SERVICE_OPTIONS) options: DalServiceOptions,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger('Mongoose');
    this.uri = options.uri;
    if (options.debug === undefined) {
      this.debug = DEFAULT_OPTIONS.debug;
    } else {
      this.debug = options.debug;
    }
  }

  async onModuleInit() {
    await this.connect(this.uri);
  }

  async connect(url: string, config: ConnectOptions = {}) {
    const debug = this.debug;
    const logger = this.logger;
    mongoose.set('debug', function (collectionName, methodName, ...methodArgs) {
      const msgMapper = (m) => {
        return util.inspect(m, false, null, false);
      };
      if (debug) {
        logger.debug(
          `${collectionName}.${methodName}` +
            `(${methodArgs.map(msgMapper).join(', ')})`,
        );
      }
    });

    const instance = await mongoose.connect(url, {
      ...config,
      autoCreate: true,
      autoIndex: true,
    });

    this.connection = instance.connection;

    return this.connection;
  }

  isConnected(): boolean {
    return this.connection && this.connection.readyState === 1;
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async destroy() {
    if (process.env.NODE_ENV !== 'test')
      throw new Error('Allowed only in test mode 123');

    await this.connection.dropDatabase();
  }
}
