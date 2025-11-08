import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    // Модуль конфигурации для работы с переменными окружения
    ConfigModule.forRoot({
      isGlobal: true, // Делает конфигурацию доступной во всех модулях
      cache: true, // Кэширует переменные окружения для производительности
    }),

    // Модули функциональности приложения
    FilmsModule, // Модуль для работы с фильмами
    OrderModule, // Модуль для обработки заказов

    // Модуль для раздачи статических файлов из папки public
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'), // Путь к папке со статикой
      serveRoot: '/content/afisha', // Базовый URL для доступа к статике
      exclude: ['/api/*'], // Исключает API маршруты
    }),
  ],

  // Контроллеры, которые принадлежат этому модулю
  controllers: [FilmsController, OrderController],

  // Провайдеры (сервисы, репозитории) для внедрения зависимостей
  providers: [configProvider, FilmsService, OrderService],
})
export class AppModule {}
