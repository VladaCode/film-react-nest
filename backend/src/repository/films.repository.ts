import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto } from 'src/films/dto/films.dto';
import { Film } from 'src/films/schemas/film.schema';

// Репозиторий для работы с фильмами в MongoDB
// Отвечает за все операции с базой данных
@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  // Получить все фильмы из базы
  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    // Преобразуем документы Mongoose в DTO
    return films.map((film) => this.toFilmDto(film));
  }

  // Найти фильм по ID
  async findById(id: string): Promise<FilmDto> {
    const film = await this.filmModel.findById(id).exec();
    if (!film) {
      return null;
    }
    // Преобразуем документ Mongoose в DTO
    return this.toFilmDto(film);
  }

  // Обновить данные фильма
  // { new: true } - возвращает обновленный документ
  async updateFilm(filmId: string, updateData: Partial<Film>): Promise<Film> {
    return this.filmModel
      .findByIdAndUpdate(filmId, updateData, { new: true })
      .exec();
  }

  // Преобразование документа Mongoose в FilmDto
  private toFilmDto(film: Film & { _id: any }): FilmDto {
    return {
      id: film._id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule,
    };
  }
}
