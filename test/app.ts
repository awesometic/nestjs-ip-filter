import {
  Controller,
  DynamicModule,
  Get,
  INestApplication,
  Module,
  UseGuards,
} from '@nestjs/common';
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

// A module that does not import IpFilter itself.
@Controller('feature')
class FeatureController {
  @Get()
  @UseGuards(IpFilterGuard)
  get() {
    return 'ok';
  }
}

@Module({ controllers: [FeatureController] })
class FeatureModule {}

// With trustProxy, tests pick the client IP through X-Forwarded-For.
export async function createAppFrom(
  ipFilterModule: DynamicModule,
  trustProxy = true,
): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [ipFilterModule, FeatureModule],
    controllers: [TestController],
  }).compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();
  app.set('trust proxy', trustProxy);
  return app.init();
}

export const createApp = (
  options: IpFilterModuleOptions & { global?: boolean },
  trustProxy = true,
) => createAppFrom(IpFilter.register(options), trustProxy);
