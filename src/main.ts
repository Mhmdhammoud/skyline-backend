import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(morgan('tiny'));
  await app.listen(5000);
}
bootstrap();
