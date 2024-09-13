import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifyModule } from './modules/notify/notify.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [NotifyModule],
})
export class AppModule {}
