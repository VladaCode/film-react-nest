import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto, SessionDto } from './dto/films.dto';
import { FilmsRepository } from 'src/repository/films.repository';

/** Унифицированный ответ списка: { total, items } */
type ListResponse<T> = { total: number; items: T[] };

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  /** Получить все фильмы (в формате { total, items }) */
  // items — массив самих данных (список фильмов, сеансов, заказов и т.д.)
  // total — общее количество элементов в списке
  async findAll(): Promise<ListResponse<FilmDto>> {
    const films = await this.filmsRepository.findAll();
    return { total: films.length, items: films };
  }

  /** Получить один фильм по id; 404 если не найден */
  async findOne(id: string): Promise<FilmDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) throw new NotFoundException(`Film with ID ${id} not found`);
    return film;
  }

  /** Получить расписание сеансов фильма (в формате { total, items }) */
  async getSchedule(id: string): Promise<ListResponse<SessionDto>> {
    const film = await this.filmsRepository.findById(id);
    if (!film) throw new NotFoundException(`Film with ID ${id} not found`);
    const sessions = (film.schedule ?? []) as SessionDto[];
    return { total: sessions.length, items: sessions };
  }
}
