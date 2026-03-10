import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { resolveDatabaseDriver } from './database/database-driver';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { AppRepositoryModule } from './repository/app-repository.module';

const getDatabaseDriver = () =>
  resolveDatabaseDriver(process.env.DATABASE_DRIVER);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.register(getDatabaseDriver()),
    AppRepositoryModule.register(getDatabaseDriver()),
    FilmsModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
})
export class AppModule {}
