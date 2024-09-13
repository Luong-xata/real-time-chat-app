import { Module } from '@nestjs/common';
import { NotifyGateway } from './notify.gateway';

@Module({
  providers: [NotifyGateway],
})
export class NotifyModule {}
