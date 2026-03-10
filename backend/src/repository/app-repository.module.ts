import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmModel, FilmSchema } from 'src/films/schemas/film.schema';
import { DatabaseDriver } from 'src/database/database-driver';
import { FilmsRepository } from './films.repository';
import { MongoFilmsRepository } from './mongodb/mongodb-films.repository';
import { FilmEntity } from './postgres/entities/film.entity';
import { ScheduleEntity } from './postgres/entities/schedule.entity';
import { PostgresFilmsRepository } from './postgres/postgres-films.repository';

@Global()
@Module({})
export class AppRepositoryModule {
  static register(driver: DatabaseDriver): DynamicModule {
    const isPostgres = driver === 'postgres';
    const repositoryProvider = {
      provide: FilmsRepository,
      useClass: isPostgres ? PostgresFilmsRepository : MongoFilmsRepository,
    };

    return {
      global: true,
      module: AppRepositoryModule,
      imports: isPostgres
        ? [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])]
        : [
            MongooseModule.forFeature([
              { name: FilmModel.name, schema: FilmSchema },
            ]),
          ],
      providers: [
        repositoryProvider,
        ...(isPostgres ? [PostgresFilmsRepository] : [MongoFilmsRepository]),
      ],
      exports: [FilmsRepository],
    };
  }
}
