import { Inject, Injectable } from '@nestjs/common';
import { IpFilterService, IPFILTER_TOKEN } from 'nestjs-ip-filter';

@Injectable()
export class AppService {
  constructor(
    @Inject(IPFILTER_TOKEN)
    private readonly ipFilterService: IpFilterService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  getCurrentIpFilterInfo(): any {
    return {
      whitelist: this.ipFilterService.whitelist ?? [],
      blacklist: this.ipFilterService.blacklist ?? [],
    };
  }
}
