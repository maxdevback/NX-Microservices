import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@purple/libs/contracts';
import { AuthService } from './auth.service';
import { Message, RMQMessage, RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    dto: AccountRegister.Request,
    @RMQMessage msg: Message
  ): Promise<AccountRegister.Response> {
    return this.authService.register(dto);
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
}
