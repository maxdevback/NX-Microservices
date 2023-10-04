import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../config/jwt.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync(getJWTConfig()),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
