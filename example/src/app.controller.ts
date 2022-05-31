import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * curl -X GET -H "Content-Type: application/json" http://localhost:3001/ipfilter
   */
  @Get('/ipfilter')
  getCurrentIpFilterInfo(): any {
    return this.appService.getCurrentIpFilterInfo();
  }
}
