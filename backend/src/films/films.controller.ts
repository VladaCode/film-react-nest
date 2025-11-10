import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto } from './dto/films.dto';

@Controller('api/afisha/films') // Базовый путь для всех маршрутов фильмов
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get() // GET /api/afisha/films — получить список всех фильмов
  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    // Возвращаем фильмы в формате { total, items }
    return this.filmsService.findAll();
  }

  @Get(':id/schedule') // GET /api/afisha/films/:id/schedule — расписание сеансов по фильму
  async getSchedule(
    @Param('id') id: string, // Получаем id фильма из URL
  ): Promise<{ total: number; items: any[] }> {
    // Возвращаем список сеансов в формате { total, items }
    return this.filmsService.getSchedule(id);
  }
}
