import { Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@purple/libs/contracts';
//import { Message, RMQMessage, RMQRoute } from 'nestjs-rmq';
import { AuthService } from './auth.service';
import { RMQRoute } from 'nestjs-rmq';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @RMQRoute(AccountLogin.topic)
  async login(dto: AccountLogin.Request) {
    console.log('Hello');
    return this.authService.login(dto);
  }
  @RMQRoute(AccountRegister.topic)
  async register(
    dto: AccountRegister.Request
  ): Promise<AccountRegister.Response> {
    return this.authService.register(dto);
  }
}
