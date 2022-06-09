import { Inject, Injectable } from "@nestjs/common";
import { IpFilterDenyHandler, IpFilterModuleOptions } from "./ipfilter.interface";
import { IPFILTER_MODULE_OPTIONS } from "./ipfilter.constants";

@Injectable()
export class IpFilterService {

  useHttpException: boolean;

  private _whitelist: string[];
  private _blacklist: string[];

  constructor(
    @Inject(IPFILTER_MODULE_OPTIONS)
    readonly options: IpFilterModuleOptions,
  ) {
    this.useHttpException = options.useHttpException ?? false;

    this._whitelist = Object.assign([], options.whitelist ?? []);
    this._blacklist = Object.assign([], options.blacklist ?? []);
  }

  get whitelist() {
    return this._whitelist;
  };

  set whitelist(whitelist: string[]) {
    this._whitelist = whitelist;
  }

  get blacklist() {
    return this._blacklist;
  };

  set blacklist(blacklist: string[]) {
    this._blacklist = blacklist;
  }
}
