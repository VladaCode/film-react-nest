import { Injectable, LogLevel, LoggerService } from '@nestjs/common';

type LoggerLevel = Extract<
  LogLevel,
  'log' | 'error' | 'warn' | 'debug' | 'verbose'
>;

type JsonLogEntry = {
  level: LoggerLevel;
  timestamp: string;
  message: unknown;
  optionalParams: unknown[];
};

@Injectable()
export class JsonLogger implements LoggerService {
  private enabledLevels = new Set<LoggerLevel>([
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ]);

  setLogLevels(levels: LoggerLevel[]): void {
    this.enabledLevels = new Set(levels);
  }

  formatMessage(
    level: LoggerLevel,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const payload: JsonLogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message: this.normalizeValue(message),
      optionalParams: optionalParams.map((value) => this.normalizeValue(value)),
    };

    return JSON.stringify(payload);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    if (!this.enabledLevels.has('log')) {
      return;
    }

    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    if (!this.enabledLevels.has('error')) {
      return;
    }

    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    if (!this.enabledLevels.has('warn')) {
      return;
    }

    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    if (!this.enabledLevels.has('debug')) {
      return;
    }

    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    if (!this.enabledLevels.has('verbose')) {
      return;
    }

    console.info(this.formatMessage('verbose', message, ...optionalParams));
  }

  private normalizeValue(value: unknown): unknown {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }

    return value;
  }
}
