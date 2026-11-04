import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IPFILTER_TOKEN } from './ipfilter.constants';
import { IpFilterDenyException } from './ipfilter-deny.exception';
import { IpFilterService } from './ipfilter.service';

@Injectable()
export class IpFilterGuard implements CanActivate {
  constructor(
    @Inject(IPFILTER_TOKEN)
    private readonly ipFilterService: IpFilterService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // req.ip honors the app's "trust proxy" setting, so forwarded headers are only used when trusted.
    const ipAddress: string | undefined = context
      .switchToHttp()
      .getRequest().ip;
    const approved = this.ipFilterService.isAllowed(ipAddress);

    if (!approved && this.ipFilterService.useDenyException) {
      throw new IpFilterDenyException(
        {
          clientIp: ipAddress,
          whitelist: this.ipFilterService.whitelist,
          blacklist: this.ipFilterService.blacklist,
        },
        403,
      );
    }

    return approved;
  }
}
