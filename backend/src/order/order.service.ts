import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';

type FilmDoc = Awaited<ReturnType<FilmsRepository['findById']>>;

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  // Создать бронь для набора билетов
  async create({ tickets }: CreateOrderDto) {
    if (!tickets?.length) {
      throw new BadRequestException('No tickets provided');
    }

    // Кэш филмов, чтобы не ходить в БД много раз
    const filmCache = new Map<string, FilmDoc>();

    // Для последующего сохранения: какие сеансы изменились
    // key: `${filmId}:${sessionId}` -> { film, sessionId }
    const touchedSessions = new Map<
      string,
      { film: FilmDoc; sessionId: string }
    >();

    // Проверка и подготовка бронирования
    const results = [];

    for (const t of tickets) {
      const filmId = t.film;
      const sessionId = t.session;

      // 1) Получаем фильм (с кэшем)
      let film = filmCache.get(filmId);
      if (!film) {
        film = await this.filmsRepository.findById(filmId);
        if (!film) throw new BadRequestException(`Film ${filmId} not found`);
        filmCache.set(filmId, film);
      }

      // 2) Находим сеанс
      const session = film.schedule.find((s) => s.id === sessionId);
      if (!session) {
        throw new BadRequestException(`Session ${sessionId} not found`);
      }

      // 3) Валидируем координаты места
      const inRows = t.row >= 1 && t.row <= session.rows;
      const inSeats = t.seat >= 1 && t.seat <= session.seats;
      if (!inRows || !inSeats) {
        throw new BadRequestException(
          `Seat ${t.row}:${t.seat} is out of range. Hall has ${session.rows} rows and ${session.seats} seats per row`,
        );
      }

      // 4) Проверяем, что место свободно
      const key = `${t.row}:${t.seat}`;
      if (session.taken.includes(key)) {
        throw new ConflictException(`Seat ${key} is already taken`);
      }

      // 5) Резервируем место в памяти
      session.taken.push(key);

      // 6) Запоминаем, что этот сеанс надо будет сохранить в БД
      touchedSessions.set(`${filmId}:${sessionId}`, { film, sessionId });

      // 7) Готовим элемент ответа
      results.push({
        id: `${filmId}-${sessionId}-${key}`,
        film: filmId,
        session: sessionId,
        daytime: session.daytime,
        day: new Date(session.daytime).toLocaleDateString('ru-RU'),
        time: new Date(session.daytime).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        row: t.row,
        seat: t.seat,
        price: session.price,
      });
    }

    // Сохраняем изменения по каждому затронутому сеансу
    for (const { film, sessionId } of touchedSessions.values()) {
      await this.filmsRepository.updateFilm(film.id, {
        schedule: film.schedule.map((s) =>
          s.id === sessionId ? { ...s, taken: s.taken } : s,
        ),
      });
    }

    return {
      total: results.length,
      items: results,
    };
  }
}
