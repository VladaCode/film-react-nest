import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsController } from './films.controller';
import { Film, FilmSchema } from './schemas/film.schema';
import { FilmsRepository } from 'src/repository/films.repository';
import { FilmsService } from './films.service';

@Module({
  imports: [
    // Регистрация схемы Film для использования в репозитории
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsRepository], // Экспорт для использования в OrderModule
})
export class FilmsModule {}
