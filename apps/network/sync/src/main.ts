import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const port = process.env.PORT || 3103;
  await app.listen(port);
  Logger.log(`🚀 Network Sync is running on: http://localhost:${port}`);
}

bootstrap();
