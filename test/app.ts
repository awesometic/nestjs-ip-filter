import { Controller, Get, INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { IpFilter, IpFilterModuleOptions } from '../lib';

@Controller()
class TestController {
  @Get()
  get() {
    return 'ok';
  }
}

// With trustProxy, tests pick the client IP through X-Forwarded-For.
export async function createApp(
  options: IpFilterModuleOptions,
  trustProxy = true,
): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [IpFilter.register(options)],
    controllers: [TestController],
  }).compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();
  app.set('trust proxy', trustProxy);
  return app.init();
}
