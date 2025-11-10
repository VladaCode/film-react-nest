import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    // Модуль конфигурации
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Подключение MongoDB (ОСНОВНОЕ подключение)
    MongooseModule.forRoot(
      process.env.DATABASE_URL || 'mongodb://localhost:27017/prac',
    ),

    // Модули приложения
    FilmsModule,
    OrderModule,

    // Раздача статики
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
})
export class AppModule {}
