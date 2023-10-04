import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/rmq.config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    AuthModule,
    MongooseModule.forRootAsync(getMongoConfig()),
  ],
})
export class AppModule {}
