import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto } from './dto/films.dto';

// Контроллер для работы с фильмами и расписанием сеансов
@Controller('api/afisha/films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  // GET эндпоинт для получения списка всех фильмов
  // Возвращает массив фильмов с основной информацией
  @Get()
  async findAll(): Promise<FilmDto[]> {
    return this.filmsService.findAll();
  }

  // GET эндпоинт для получения конкретного фильма с расписанием сеансов
  // :id - параметр пути (UUID фильма)
  // Возвращает полную информацию о фильме включая все сеансы
  @Get(':id/schedule')
  async findOne(@Param('id') id: string): Promise<FilmDto> {
    return this.filmsService.findOne(id);
  }
}
