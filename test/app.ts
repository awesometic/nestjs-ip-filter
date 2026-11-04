import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { IpFilter, IpFilterGuard, IpFilterModuleOptions } from '../lib';

@Controller()
class TestController {
  @Get()
  get() {
    return 'ok';
  }

  @Get('guarded')
  @UseGuards(IpFilterGuard)
  guarded() {
    return 'ok';
  }
}

// With trustProxy, tests pick the client IP through X-Forwarded-For.
export async function createApp(
  options: IpFilterModuleOptions & { global?: boolean },
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
