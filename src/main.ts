import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AuthGuard} from "@nestjs/passport";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3003);
  app.useGlobalGuards(new (AuthGuard('jwt')));
}
bootstrap();
