import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';

// Сервис для обработки бизнес-логики бронирования билетов
// Отвечает за создание заказов, проверку доступности мест и резервирование
@Injectable()
export class OrderService {
  // Внедрение репозитория для работы с данными фильмов
  constructor(private readonly filmsRepository: FilmsRepository) {}

  // Основной метод создания заказа на бронирование билетов
  async create(createOrderDto: CreateOrderDto) {
    const { filmId, sessionId, seats } = createOrderDto;

    // Поиск фильма по ID в базе данных
    const film = await this.filmsRepository.findById(filmId);
    if (!film) {
      throw new BadRequestException('Film not found');
    }

    // Поиск конкретного сеанса в расписании фильма
    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new BadRequestException('Session not found');
    }

    // Валидация координат мест - проверка что места существуют в зале
    for (const seat of seats) {
      if (
        seat.row < 1 ||
        seat.row > session.rows ||
        seat.seat < 1 ||
        seat.seat > session.seats
      ) {
        throw new BadRequestException(
          `Seat ${seat.row}:${seat.seat} is out of range. Hall has ${session.rows} rows and ${session.seats} seats per row`,
        );
      }
    }

    // Преобразование координат мест в строковый формат 'ряд:место'
    const seatKeys = seats.map((seat) => `${seat.row}:${seat.seat}`);

    // Проверка что выбранные места не заняты другими зрителями
    for (const seatKey of seatKeys) {
      if (session.taken.includes(seatKey)) {
        throw new ConflictException(`Seat ${seatKey} is already taken`);
      }
    }

    // Резервирование мест - добавление в массив занятых
    session.taken.push(...seatKeys);

    // Сохранение изменений в базе данных - обновление расписания сеанса
    await this.filmsRepository.updateFilm(filmId, {
      schedule: film.schedule.map((s) =>
        s.id === sessionId ? { ...s, taken: session.taken } : s,
      ),
    });

    // Возврат успешного ответа клиенту
    return {
      success: true,
      message: `Successfully booked ${seats.length} seat(s)`,
      bookedSeats: seatKeys,
      totalPrice: seats.length * session.price, // Расчет общей стоимости
    };
  }
}
