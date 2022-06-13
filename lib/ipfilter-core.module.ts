import { Global, Module, Provider, Type } from "@nestjs/common";
import { IpFilterModuleAsyncOptions, IpFilterModuleOptions, IpFilterOptionsFactory } from "./ipfilter.interface";
import { IPFILTER_MODULE_OPTIONS, IPFILTER_TOKEN } from "./ipfilter.constants";
import { createIpFilterProviders } from "./ipfilter.providers";
import { IpFilterService } from "./ipfilter.service";
import { APP_GUARD } from "@nestjs/core";
import { IpFilterGuard } from "./ipfilter.guard";

@Global()
@Module({})
export class IpFilterCoreModule {
  static forRoot(options: IpFilterModuleOptions) {
    const ipFilterServiceProvider = createIpFilterProviders(options);
    const ipFilterGuardProvider = {
      provide: APP_GUARD,
      useClass: IpFilterGuard,
    };

    return {
      module: IpFilterCoreModule,
      providers: [ipFilterGuardProvider, ipFilterServiceProvider],
      exports: [ipFilterServiceProvider],
    };
  }

  static forRootAsync(options: IpFilterModuleAsyncOptions) {
    const provider: Provider = {
      inject: [IPFILTER_MODULE_OPTIONS],
      provide: IPFILTER_TOKEN,
      useFactory: (options: IpFilterModuleOptions) => new IpFilterService(options),
    };
    const ipFilterGuardProvider = {
      provide: APP_GUARD,
      useClass: IpFilterGuard,
    };

    return {
      module: IpFilterCoreModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        ipFilterGuardProvider,
        provider,
      ],
      exports: [provider],
    };
  }

  private static createAsyncProviders(options: IpFilterModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsnycOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<IpFilterOptionsFactory>;

    return [
      this.createAsnycOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsnycOptionsProvider(options: IpFilterModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: IPFILTER_MODULE_OPTIONS,
        useFactory: options.useFactory,
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<IpFilterOptionsFactory>,
    ]

    return {
      provide: IPFILTER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: IpFilterOptionsFactory) => await optionsFactory.createIpFilterModuleOptions(),
      inject,
    };
  }
}
