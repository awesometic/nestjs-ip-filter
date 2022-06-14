import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { IpFilter } from 'nestjs-ip-filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpFilterDenyExceptionFilter } from './exception/ipfilter-exception-filter.exception';
import { IpRepositoryModule } from './ip-repository/ip-repository.module';
import { IpRepositoryService } from './ip-repository/ip-repository.service';

@Module({
  imports: [
    /**
     * Allowing the IPs from the whitelist is prior to denying from the blacklist
     */
    IpFilter.forRootAsync({
      imports: [IpRepositoryModule],
      inject: [IpRepositoryService],
      useFactory: async (ipRepositoryService: IpRepositoryService) => ({
        whitelist: ipRepositoryService.getWhitelistIpAddresses(),
        // blacklist: [ '127.0.0.1' ],
        useDenyException: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: IpFilterDenyExceptionFilter,
    },
  ],
})
export class AppModule {}
