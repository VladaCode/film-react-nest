import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto } from './dto/films.dto';
import { FilmsRepository } from 'src/repository/films.repository';

// Сервис для бизнес-логики работы с фильмами
// Связывает контроллер и репозиторий, обрабатывает ошибки
@Injectable()
export class FilmsService {
  // Внедрение зависимости репозитория для работы с базой данных
  constructor(private readonly filmsRepository: FilmsRepository) {}

  // Получить все фильмы из базы данных
  // Возвращает массив FilmDto для ответа клиенту
  async findAll(): Promise<FilmDto[]> {
    return this.filmsRepository.findAll();
  }

  // Найти конкретный фильм по ID вместе с расписанием сеансов
  // Если фильм не найден - выбрасывает исключение 404
  async findOne(id: string): Promise<FilmDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return film;
  }
}
