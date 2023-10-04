import { Controller, Get } from '@nestjs/common';
import { AccountLogin } from '@purple/libs/contracts';

import { AppService } from './app.service';
import { RMQService } from 'nestjs-rmq';

@Controller()
export class AppController {
  constructor(private readonly rmqService: RMQService) {}

  @Get('/')
  getData() {
    return this.rmqService.send(AccountLogin.topic, 'Hello world');
  }
}
