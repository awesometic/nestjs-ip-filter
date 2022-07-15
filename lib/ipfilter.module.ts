import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { IPFILTER_TOKEN } from './ipfilter.constants';
import { IpFilterGuard } from './ipfilter.guard';
import { ConfigurableModuleClass } from './ipfilter.module-definition';
import { IpFilterService } from './ipfilter.service';

const ipFilterServiceProvider = {
  provide: IPFILTER_TOKEN,
  useClass: IpFilterService,
};

const ipFilterGuardProvider = {
  provide: APP_GUARD,
  useClass: IpFilterGuard,
};

@Module({
  providers: [ipFilterServiceProvider, ipFilterGuardProvider],
  exports: [ipFilterServiceProvider],
})
export class IpFilter extends ConfigurableModuleClass {}
