import { Injectable, LogLevel, LoggerService } from '@nestjs/common';

type LoggerLevel = Extract<
  LogLevel,
  'log' | 'error' | 'warn' | 'debug' | 'verbose'
>;

@Injectable()
export class TskvLogger implements LoggerService {
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
    const fields: Record<string, string> = {
      level,
      time: new Date().toISOString(),
      message: this.stringifyValue(message),
    };

    optionalParams.forEach((param, index) => {
      fields[`param${index}`] = this.stringifyValue(param);
    });

    return Object.entries(fields)
      .map(([key, value]) => `${this.escape(key)}=${this.escape(value)}`)
      .join('\t');
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

  private stringifyValue(value: unknown): string {
    if (value instanceof Error) {
      return JSON.stringify({
        name: value.name,
        message: value.message,
        stack: value.stack,
      });
    }

    if (typeof value === 'string') {
      return value;
    }

    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return JSON.stringify(value);
  }

  private escape(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n');
  }
}
