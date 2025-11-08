import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmsModule } from '../films/films.module';

// Модуль для функциональности заказов и бронирования билетов
// Организует зависимости и внедрение сервисов для работы с заказами
@Module({
  imports: [FilmsModule], // Импорт FilmsModule для доступа к FilmsRepository
  controllers: [OrderController], // Регистрация контроллера обработки HTTP запросов заказов
  providers: [OrderService], // Регистрация сервиса с бизнес-логикой бронирования
})
export class OrderModule {}
