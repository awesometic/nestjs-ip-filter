import { ConsoleLoggerOptions, ModuleMetadata, Type } from "@nestjs/common";

export type IpFilterModuleOptions = {
  defaultBehavior: 'allow' | 'deny',
  useHttpException?: boolean,
  httpExceptionMessage?: string,
  whitelist?: string[],
  blacklist?: string[],
} & ConsoleLoggerOptions;

export interface IpFilterOptionsFactory {
  createIpFilterModuleOptions(): Promise<IpFilterModuleOptions> | IpFilterModuleOptions;
}

export interface IpFilterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[],
  useClass?: Type<IpFilterOptionsFactory>;
  useExisting?: Type<IpFilterOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<IpFilterModuleOptions> | IpFilterModuleOptions;
}
