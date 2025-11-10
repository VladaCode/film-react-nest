import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    // Конфигурация из переменных окружения
    database: {
      driver: process.env.DATABASE_DRIVER || 'mongodb', // Драйвер БД
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017/films', // URL из DATABASE_URL
    },
  },
};

export interface AppConfig {
  database: AppConfigDatabase; // Конфигурация базы данных
}

export interface AppConfigDatabase {
  driver: string; // Драйвер базы данных
  url: string; // URL для подключения к БД
}
