import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const orderServiceMock = {
    create: jest.fn<
      Promise<{ total: number; items: unknown[] }>,
      [CreateOrderDto]
    >(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderServiceMock }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates order via service', async () => {
    const dto: CreateOrderDto = {
      email: 'user@example.com',
      phone: '+79991234567',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          row: 2,
          seat: 4,
        },
      ],
    };
    const response = {
      total: 1,
      items: [
        {
          id: 'film-1-session-1-2:4',
          film: 'film-1',
          session: 'session-1',
          row: 2,
          seat: 4,
          daytime: '2026-03-07T10:00:00.000Z',
          day: '7 марта',
          time: '10:00',
          price: 500,
        },
      ],
    };
    orderServiceMock.create.mockResolvedValue(response);

    await expect(controller.create(dto)).resolves.toEqual(response);
    expect(orderServiceMock.create).toHaveBeenCalledWith(dto);
  });
});
