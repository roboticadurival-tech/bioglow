import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' }); // libera o navegador a chamar a API; depois trocamos '*' pelo endereço real do front

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('🚀 Backend a rodar na porta 3000 e ligado ao Mosquitto!');
}
bootstrap();