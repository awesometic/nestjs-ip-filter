import { Inject, Injectable } from '@nestjs/common';
import { BlockList, isIP } from 'node:net';
import { IpFilterModuleOptions } from './ipfilter.interface';
import { MODULE_OPTIONS_TOKEN } from './ipfilter.module-definition';

const familyOf = (address: string) => (isIP(address) === 6 ? 'ipv6' : 'ipv4');

// Accepts "address" or "address/prefix", IPv4 or IPv6.
function toBlockList(rules: string[]): BlockList {
  const list = new BlockList();
  for (const raw of rules) {
    const [address, prefix, ...rest] = raw.trim().split('/');
    const family = isIP(address);
    const maxPrefix = family === 4 ? 32 : 128;
    if (
      family === 0 ||
      rest.length > 0 ||
      (prefix !== undefined &&
        (!/^\d+$/.test(prefix) || Number(prefix) > maxPrefix))
    ) {
      throw new Error(`Invalid IP filter rule: "${raw}"`);
    }
    if (prefix === undefined) {
      list.addAddress(address, familyOf(address));
    } else {
      list.addSubnet(address, Number(prefix), familyOf(address));
    }
  }
  return list;
}

@Injectable()
export class IpFilterService {
  useDenyException: boolean;

  // undefined = not configured, which is not the same as an empty list.
  private _whitelist?: string[];
  private _blacklist?: string[];
  private whitelistRules?: BlockList;
  private blacklistRules?: BlockList;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    readonly options: IpFilterModuleOptions,
  ) {
    if (options.whitelist === undefined && options.blacklist === undefined) {
      throw new Error('IpFilter: configure "whitelist", "blacklist" or both');
    }
    this.useDenyException = options.useDenyException ?? false;
    if (options.whitelist) this.whitelist = options.whitelist;
    if (options.blacklist) this.blacklist = options.blacklist;
  }

  get whitelist(): string[] | undefined {
    return this._whitelist && [...this._whitelist];
  }

  set whitelist(whitelist: string[]) {
    this.whitelistRules = toBlockList(whitelist);
    this._whitelist = [...whitelist];
  }

  get blacklist(): string[] | undefined {
    return this._blacklist && [...this._blacklist];
  }

  set blacklist(blacklist: string[]) {
    this.blacklistRules = toBlockList(blacklist);
    this._blacklist = [...blacklist];
  }

  isAllowed(ip: string | undefined): boolean {
    if (!ip || isIP(ip) === 0) {
      return false;
    }
    const family = familyOf(ip);
    if (this.blacklistRules?.check(ip, family)) {
      return false;
    }
    return this.whitelistRules?.check(ip, family) ?? true;
  }
}
