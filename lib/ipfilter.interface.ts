import { ModuleMetadata, Type } from "@nestjs/common";

export type IpFilterModuleOptions = {
  whitelist?: string[],
  blacklist?: string[],

  useHttpException?: boolean,
};

export interface IpFilterDenyHandler {
  handle(): boolean;
}

export interface IpFilterOptionsFactory {
  createIpFilterModuleOptions(): Promise<IpFilterModuleOptions> | IpFilterModuleOptions;
}

export interface IpFilterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[],
  useClass?: Type<IpFilterOptionsFactory>;
  useExisting?: Type<IpFilterOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<IpFilterModuleOptions> | IpFilterModuleOptions;
}
