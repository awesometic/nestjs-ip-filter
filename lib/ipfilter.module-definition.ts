import { ConfigurableModuleBuilder } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { IpFilterGuard } from './ipfilter.guard';
import { IpFilterModuleOptions } from './ipfilter.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<IpFilterModuleOptions>()
  .setExtras({ global: true }, (definition, extras) => ({
    ...definition,
    providers: extras.global
      ? [
          ...(definition.providers ?? []),
          { provide: APP_GUARD, useClass: IpFilterGuard },
        ]
      : definition.providers,
  }))
  .build();
