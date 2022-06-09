import { Injectable } from "@nestjs/common";

@Injectable()
export class IpRepositoryService {

  /**
   * '::1' is from the Postman on macOS
   * '::ffff:127.0.0.1' is from the `curl` command on iTerm2
   * '127.0.0.1' is a typical localhost IP address
   */
  private whitelistIpAddresses = [
    '::1',
    '::ffff:127.0.0.1',
    '127.0.0.1',
  ];

  getWhitelistIpAddresses(): string[] {
    return this.whitelistIpAddresses;
  }
}
