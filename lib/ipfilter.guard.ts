import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import * as requestIp from '@supercharge/request-ip';
import { IpFilterService } from "./ipfilter.service";
import { IPFILTER_TOKEN } from "./ipfilter.constants";
 
@Injectable()
export class IpFilterGuard implements CanActivate {

  constructor(
    @Inject(IPFILTER_TOKEN)
    private readonly ipFilterService: IpFilterService,
  ) {}

  canActivate(
    context: ExecutionContext
  ): Promise<boolean> | Observable<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    const ipAddress: string = requestIp.getClientIp(request);

    const whitelist = this.ipFilterService.whitelist;
    const blacklist = this.ipFilterService.blacklist;

    let approved = false;

    if (whitelist.length > 0) {
      approved = whitelist.some((item) => {
        return new RegExp(item).test(ipAddress);
      });
    }

    if (blacklist.length > 0) {
      approved = blacklist.some((item) => {
        return new RegExp(item).test(ipAddress);
      });
    }

    if (!approved && this.ipFilterService.useHttpException) {
      throw new HttpException({
        clientIp: ipAddress,
        whitelist: whitelist,
        blacklist: blacklist
      }, 403);
    }

    return approved;
  }
}
