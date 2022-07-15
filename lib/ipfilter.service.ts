import { Inject, Injectable } from '@nestjs/common';
import { IpFilterModuleOptions } from './ipfilter.interface';
import { MODULE_OPTIONS_TOKEN } from './ipfilter.module-definition';

@Injectable()
export class IpFilterService {
  useDenyException: boolean;

  private _whitelist: string[];
  private _blacklist: string[];

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    readonly options: IpFilterModuleOptions,
  ) {
    this.useDenyException = options.useDenyException ?? false;

    this._whitelist = Object.assign([], options.whitelist ?? []);
    this._blacklist = Object.assign([], options.blacklist ?? []);
  }

  get whitelist() {
    return this._whitelist;
  }

  set whitelist(whitelist: string[]) {
    this._whitelist = whitelist;
  }

  get blacklist() {
    return this._blacklist;
  }

  set blacklist(blacklist: string[]) {
    this._blacklist = blacklist;
  }
}
