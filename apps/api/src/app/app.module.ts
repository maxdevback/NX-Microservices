import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/rmq.config';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from './config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AuthController, UserController],
  providers: [AppService],
})
export class AppModule {}
