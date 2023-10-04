import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/rmq.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RMQModule.forRootAsync(getRMQConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
