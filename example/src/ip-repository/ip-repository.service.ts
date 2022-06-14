import { Injectable } from '@nestjs/common';

@Injectable()
export class IpRepositoryService {
  /**
   * '(^::1)' is from the Postman on macOS
   * '(^192.168.)' is for the local network, using 192.168.0.1/16 subnet mask
   * '127.0.0.1' is a typical localhost IP address
   */
  private whitelistIpAddresses = ['(^::1)', '(^192.168.)', '127.0.0.1'];

  getWhitelistIpAddresses(): string[] {
    return this.whitelistIpAddresses;
  }
}
