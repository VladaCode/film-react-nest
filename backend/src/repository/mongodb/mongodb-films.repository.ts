import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto } from 'src/films/dto/films.dto';
import { FilmModel } from 'src/films/schemas/film.schema';
import { FilmsRepository } from '../films.repository';

@Injectable()
export class MongoFilmsRepository extends FilmsRepository {
  constructor(
    @InjectModel(FilmModel.name)
    private readonly filmModel: Model<FilmModel>,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean().exec();
    return films.map((film) => this.toFilmDto(film));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findOne({ id }).lean().exec();
    return film ? this.toFilmDto(film) : null;
  }

  async updateFilm(
    filmId: string,
    updateData: Partial<FilmDto>,
  ): Promise<FilmDto | null> {
    const updatedFilm = await this.filmModel
      .findOneAndUpdate({ id: filmId }, updateData, { new: true })
      .lean()
      .exec();

    return updatedFilm ? this.toFilmDto(updatedFilm) : null;
  }

  private toFilmDto(film: FilmModel): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule || [],
    };
  }
}
