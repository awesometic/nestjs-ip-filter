import { Module } from '@nestjs/common';
import { IpRepositoryService } from './ip-repository.service';

@Module({
  providers: [IpRepositoryService],
  exports: [IpRepositoryService],
})
export class IpRepositoryModule {}
