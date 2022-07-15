import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IpFilterModuleOptions } from './ipfilter.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<IpFilterModuleOptions>().build();
