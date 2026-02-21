import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmDto, SessionDto } from 'src/films/dto/films.dto';
import { Repository } from 'typeorm';
import { FilmsRepository } from '../films.repository';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';

@Injectable()
export class PostgresFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({
      relations: { schedule: true },
    });

    return films.map((film) => this.toFilmDto(film));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });

    return film ? this.toFilmDto(film) : null;
  }

  async updateFilm(
    filmId: string,
    updateData: Partial<FilmDto>,
  ): Promise<FilmDto | null> {
    const { schedule, ...filmData } = updateData;
    const filmUpdate: Partial<FilmEntity> = {};

    if (filmData.rating !== undefined) filmUpdate.rating = filmData.rating;
    if (filmData.director !== undefined)
      filmUpdate.director = filmData.director;
    if (filmData.tags !== undefined) filmUpdate.tags = filmData.tags;
    if (filmData.image !== undefined) filmUpdate.image = filmData.image;
    if (filmData.cover !== undefined) filmUpdate.cover = filmData.cover;
    if (filmData.title !== undefined) filmUpdate.title = filmData.title;
    if (filmData.about !== undefined) filmUpdate.about = filmData.about;
    if (filmData.description !== undefined)
      filmUpdate.description = filmData.description;

    if (Object.keys(filmUpdate).length) {
      await this.filmRepository.update({ id: filmId }, filmUpdate);
    }

    if (Array.isArray(schedule)) {
      for (const session of schedule) {
        await this.scheduleRepository.update(
          { id: session.id, filmId },
          { taken: session.taken || [] },
        );
      }
    }

    return this.findById(filmId);
  }

  private toFilmDto(film: FilmEntity): FilmDto {
    const schedule = [...(film.schedule || [])]
      .sort(
        (left, right) =>
          new Date(left.daytime).getTime() - new Date(right.daytime).getTime(),
      )
      .map((session) => this.toSessionDto(session));

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
      schedule,
    };
  }

  private toSessionDto(session: ScheduleEntity): SessionDto {
    const daytime =
      session.daytime instanceof Date
        ? session.daytime.toISOString()
        : new Date(session.daytime).toISOString();

    return {
      id: session.id,
      daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken || [],
    };
  }
}
