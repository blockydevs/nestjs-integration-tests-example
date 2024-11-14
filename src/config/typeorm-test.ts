import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions, LoggerOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const logging: LoggerOptions = process.env.DATABASE_LOGGING_LEVEL
  ? (process.env.DATABASE_LOGGING_LEVEL.split(',') as LoggerOptions)
  : false;

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5434,
  username: process.env.DATABASE_USERNAME || 'admin',
  password: process.env.DATABASE_PASSWORD || 'admin',
  database: process.env.DATABASE_NAME || 'integration_tests_database',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  logging: logging,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  migrationsRun: process.env.DATABASE_AUTO_RUN_MIGRATIONS === 'true',
};

export default registerAs('typeorm-test', () => config);
export const dataSourceTest = new DataSource(config);
