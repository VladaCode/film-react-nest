import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats log records as JSON', () => {
    const result = logger.formatMessage('log', 'hello', { context: 'App' });
    const payload = JSON.parse(result) as {
      level: string;
      timestamp: string;
      message: string;
      optionalParams: Array<{ context: string }>;
    };

    expect(payload.level).toBe('log');
    expect(payload.message).toBe('hello');
    expect(payload.optionalParams).toEqual([{ context: 'App' }]);
    expect(Number.isNaN(Date.parse(payload.timestamp))).toBe(false);
  });

  it('writes warn logs to console.warn', () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    logger.warn('warn message', 'context');

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleWarnSpy.mock.calls[0][0] as string) as {
      level: string;
      message: string;
      optionalParams: string[];
    };
    expect(payload.level).toBe('warn');
    expect(payload.message).toBe('warn message');
    expect(payload.optionalParams).toEqual(['context']);
  });

  it('writes error logs to console.error', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('error message', { requestId: 'r-1' });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleErrorSpy.mock.calls[0][0] as string) as {
      level: string;
      message: string;
      optionalParams: Array<{ requestId: string }>;
    };
    expect(payload.level).toBe('error');
    expect(payload.message).toBe('error message');
    expect(payload.optionalParams).toEqual([{ requestId: 'r-1' }]);
  });

  it('writes debug logs to console.debug', () => {
    const consoleDebugSpy = jest
      .spyOn(console, 'debug')
      .mockImplementation(() => undefined);

    logger.debug('debug message', { traceId: 't-1' });

    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleDebugSpy.mock.calls[0][0] as string) as {
      level: string;
      message: string;
      optionalParams: Array<{ traceId: string }>;
    };
    expect(payload.level).toBe('debug');
    expect(payload.message).toBe('debug message');
    expect(payload.optionalParams).toEqual([{ traceId: 't-1' }]);
  });

  it('writes verbose logs to console.info', () => {
    const consoleInfoSpy = jest
      .spyOn(console, 'info')
      .mockImplementation(() => undefined);

    logger.verbose('verbose message', 'context');

    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleInfoSpy.mock.calls[0][0] as string) as {
      level: string;
      message: string;
      optionalParams: string[];
    };
    expect(payload.level).toBe('verbose');
    expect(payload.message).toBe('verbose message');
    expect(payload.optionalParams).toEqual(['context']);
  });

  it('respects configured log levels', () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    logger.setLogLevels(['error']);
    logger.log('will be skipped');

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
