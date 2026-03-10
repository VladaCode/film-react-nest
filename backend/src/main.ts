import { LoggerService, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

const parseCorsOrigins = (value: string): string[] =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

type LoggerMode = 'dev' | 'json' | 'tskv';

const createLogger = (mode?: string): LoggerService => {
  const normalized = mode?.toLowerCase() as LoggerMode | undefined;

  if (normalized === 'json') {
    return new JsonLogger();
  }

  if (normalized === 'tskv') {
    return new TskvLogger();
  }

  return new DevLogger();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  app.useLogger(createLogger(configService.get<string>('LOG_FORMAT')));

  const corsOriginsValue =
    configService.get<string>('CORS_ORIGINS') ||
    'http://localhost:5173,http://localhost:5174';
  const allowedOrigins = parseCorsOrigins(corsOriginsValue);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = Number(configService.get<string>('PORT') || 3000);
  await app.listen(port);
}

bootstrap();
