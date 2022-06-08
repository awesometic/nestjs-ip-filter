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

    // TODO: Remove this debugging message in production
    console.log(`From IP address: ${ipAddress}`);

    // Check the plain text whitelists
    for (const whiteIp of whitelist) {
      if (whiteIp === ipAddress) {
        return true;
      }
    }

    // Check the plain text blacklists
    for (const blackIp of blacklist) {
      if (blackIp === ipAddress) {
        return this.denyThisRequest();
      }
    }

    return this.ipFilterService.defaultBehavior;
  }

  private denyThisRequest() {
    if (this.ipFilterService.useHttpException) {
      throw new HttpException(this.ipFilterService.httpExceptionMessage, 403);
    } else {
      return false;
    }
  }
}
