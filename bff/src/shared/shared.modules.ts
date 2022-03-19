import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/module-options';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  providers: [],
  exports: [],
})
export class SharedModules {}
