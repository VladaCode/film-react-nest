import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

// Контроллер для обработки заказов билетов
@Controller('api/afisha/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST эндпоинт для создания нового заказа
  // Принимает данные бронирования и передает в сервис для обработки
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
}
