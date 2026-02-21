import { FilmDto } from 'src/films/dto/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;

  abstract findById(id: string): Promise<FilmDto | null>;

  abstract updateFilm(
    filmId: string,
    updateData: Partial<FilmDto>,
  ): Promise<FilmDto | null>;
}
