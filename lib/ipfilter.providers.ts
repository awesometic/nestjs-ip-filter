import { Provider } from "@nestjs/common";
import { IpFilterModuleOptions } from "./ipfilter.interface";
import { IPFILTER_TOKEN } from "./ipfilter.constants";
import { IpFilterService } from "./ipfilter.service";

export function createIpFilterProviders(options: IpFilterModuleOptions): Provider {
  return {
    provide: IPFILTER_TOKEN,
    useValue: new IpFilterService(options),
  };
}
