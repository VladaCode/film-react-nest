import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseDriver } from './database-driver';
import { FilmEntity } from 'src/repository/postgres/entities/film.entity';
import { ScheduleEntity } from 'src/repository/postgres/entities/schedule.entity';

const resolvePostgresConfig = (configService: ConfigService) => {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (databaseUrl?.startsWith('postgres')) {
    const parsed = new URL(databaseUrl);

    return {
      host: parsed.hostname,
      port: Number(parsed.port || 5432),
      username: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace('/', ''),
    };
  }

  return {
    host: configService.get<string>('DATABASE_HOST') || 'localhost',
    port: Number(configService.get<string>('DATABASE_PORT') || 5432),
    username: configService.get<string>('DATABASE_USERNAME') || 'postgres',
    password: configService.get<string>('DATABASE_PASSWORD') || 'postgres',
    database: configService.get<string>('DATABASE_NAME') || 'prac',
  };
};

@Module({})
export class DatabaseModule {
  static register(driver: DatabaseDriver): DynamicModule {
    const imports =
      driver === 'postgres'
        ? [
            TypeOrmModule.forRootAsync({
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => {
                const postgresConfig = resolvePostgresConfig(configService);

                return {
                  type: 'postgres' as const,
                  host: postgresConfig.host,
                  port: postgresConfig.port,
                  username: postgresConfig.username,
                  password: postgresConfig.password,
                  database: postgresConfig.database,
                  entities: [FilmEntity, ScheduleEntity],
                  synchronize: false,
                };
              },
            }),
          ]
        : [
            MongooseModule.forRootAsync({
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => ({
                uri:
                  configService.get<string>('DATABASE_URL') ||
                  'mongodb://localhost:27017/prac',
              }),
            }),
          ];

    return {
      module: DatabaseModule,
      imports: [ConfigModule, ...imports],
    };
  }
}
