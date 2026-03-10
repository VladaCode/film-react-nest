export type DatabaseDriver = 'mongodb' | 'postgres';

export const resolveDatabaseDriver = (driver?: string): DatabaseDriver =>
  driver?.toLowerCase() === 'postgres' ? 'postgres' : 'mongodb';
