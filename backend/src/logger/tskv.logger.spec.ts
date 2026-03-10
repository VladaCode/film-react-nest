import { TskvLogger } from './tskv.logger';

const parseTskvLine = (line: string): Record<string, string> =>
  Object.fromEntries(
    line.split('\t').map((part) => {
      const separatorIndex = part.indexOf('=');
      const key = part.slice(0, separatorIndex);
      const value = part.slice(separatorIndex + 1);
      return [key, value];
    }),
  );

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats records as tab-separated key=value pairs', () => {
    const result = logger.formatMessage('log', 'hello', { context: 'App' });
    const payload = parseTskvLine(result);

    expect(payload.level).toBe('log');
    expect(payload.message).toBe('hello');
    expect(payload.param0).toBe('{"context":"App"}');
    expect(Number.isNaN(Date.parse(payload.time))).toBe(false);
  });

  it('escapes tabs and new lines in values', () => {
    const result = logger.formatMessage('log', 'one\ttwo\nthree');

    expect(result).toContain('message=one\\ttwo\\nthree');
  });

  it('writes debug logs to console.debug', () => {
    const consoleDebugSpy = jest
      .spyOn(console, 'debug')
      .mockImplementation(() => undefined);

    logger.debug('debug message', 42);

    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    const payload = parseTskvLine(consoleDebugSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe('debug');
    expect(payload.message).toBe('debug message');
    expect(payload.param0).toBe('42');
  });

  it('writes error logs to console.error', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('error message', { requestId: 'r-1' });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const payload = parseTskvLine(consoleErrorSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe('error');
    expect(payload.message).toBe('error message');
    expect(payload.param0).toBe('{"requestId":"r-1"}');
  });

  it('writes verbose logs to console.info', () => {
    const consoleInfoSpy = jest
      .spyOn(console, 'info')
      .mockImplementation(() => undefined);

    logger.verbose('verbose message', 'context');

    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    const payload = parseTskvLine(consoleInfoSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe('verbose');
    expect(payload.message).toBe('verbose message');
    expect(payload.param0).toBe('context');
  });

  it('respects configured log levels', () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    logger.setLogLevels(['error']);
    logger.warn('will be skipped');

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
