import { Injectable } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@purple/libs/contracts';

@Injectable()
export class AuthService {
  login(dto: AccountLogin.Request): AccountLogin.Response {
    return { access_token: dto.password };
  }
  register(dto: AccountRegister.Request): AccountRegister.Response {
    return { email: dto.email };
  }
}
