import { Module } from '@nestjs/common';
import { IpFilter, IpFilterModuleOptions } from 'nestjs-ip-filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpRepositoryModule } from './ip-repository/ip-repository.module';
import { IpRepositoryService } from './ip-repository/ip-repository.service';

@Module({
  imports: [
    /**
     * Allowing the IPs from the whitelist is prior to denying from the blacklist
     */
    IpFilter.forRootAsync({
      imports: [ IpRepositoryModule ],
      inject: [ IpRepositoryService ],
      useFactory: async (ipRepositoryService: IpRepositoryService) => {
        return {
          whitelist: ipRepositoryService.getWhitelistIpAddresses(),
        } as IpFilterModuleOptions;
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
