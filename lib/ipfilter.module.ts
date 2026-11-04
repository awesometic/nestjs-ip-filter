import { Module } from '@nestjs/common';
import { IPFILTER_TOKEN } from './ipfilter.constants';
import { ConfigurableModuleClass } from './ipfilter.module-definition';
import { IpFilterService } from './ipfilter.service';

const ipFilterServiceProvider = {
  provide: IPFILTER_TOKEN,
  useClass: IpFilterService,
};

@Module({
  providers: [ipFilterServiceProvider],
  exports: [ipFilterServiceProvider],
})
export class IpFilter extends ConfigurableModuleClass {}
