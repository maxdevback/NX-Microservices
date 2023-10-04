import { IRMQServiceAsyncOptions } from 'nestjs-rmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    exchangeName: 'purple',
    connections: [
      {
        login: configService.getOrThrow('AMQP_LOGIN'),
        password: configService.getOrThrow('AMQP_PASSWORD'),
        host: configService.getOrThrow('AMQP_HOST'),
        port: configService.getOrThrow('AMQP_PORT'),
      },
    ],
    queueName: configService.getOrThrow('AMQP_QUEUE'),
    prefetchCount: 32,
    serviceName: configService.getOrThrow('AMQP_SERVICE_NAME'),
  }),
});
