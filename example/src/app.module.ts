import { Module } from '@nestjs/common';
import { IpFilter } from 'nestjs-ip-filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    /**
     * '::ffff:127.0.0.1' is from the `curl` command on iTerm2
     * Allowing the IPs from the whitelist is prior to denying from the blacklist
     * 
     * Test command: curl -X GET -H "Content-Type: application/json" http://localhost:3001
     */
    IpFilter.forRoot({
      defaultBehavior: 'allow',
      whitelist: [
        '::ffff:127.0.0.1'
      ],
      blacklist: [
        '::ffff:127.0.0.1'
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
