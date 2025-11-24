import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8080);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Remove chaves que não estão no DTO
      forbidNonWhitelisted: true, //Levanta erro quando a chave não existe
      transform: true, //Tenta transformar os tipos de dados de param e dtos
    }),
  );
}
bootstrap();
