import { DynamicModule, Module } from "@nestjs/common";
import { IpFilterCoreModule } from "./ipfilter-core.module";
import { IpFilterModuleAsyncOptions, IpFilterModuleOptions } from "./ipfilter.interface";

Module({})
export class IpFilter {
  static forRoot(options: IpFilterModuleOptions): DynamicModule {
    return {
      module: IpFilter,
      imports: [
        IpFilterCoreModule.forRoot(options),
      ]
    }
  }

  static forRootAsync(options: IpFilterModuleAsyncOptions): DynamicModule {
    return {
      module: IpFilter,
      imports: [
        IpFilterCoreModule.forRootAsync(options),
      ]
    }
  }
}
