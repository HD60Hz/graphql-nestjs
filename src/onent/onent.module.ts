import { Module } from '@nestjs/common';
import { OnentService } from './onent.service';
import { OnentResolver } from './onent.resolver';

@Module({
  providers: [OnentService, OnentResolver]
})
export class OnentModule {}
