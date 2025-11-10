import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Создаём экземпляр приложения Nest на базе корневого модуля
  const app = await NestFactory.create(AppModule);

  // Разрешаем запросы с фронта
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  // Глобальная валидация входящих DTO:
  // - whitelist: выкидывает лишние поля
  // - transform: приводит типы и применяет @Type() из class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Стартуем сервер на порту из .env (PORT) или 3000 по умолчанию
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

bootstrap();
