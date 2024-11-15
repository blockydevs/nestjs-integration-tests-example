import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions, LoggerOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const logging: LoggerOptions = process.env.DATABASE_LOGGING_LEVEL
  ? (process.env.DATABASE_LOGGING_LEVEL.split(',') as LoggerOptions)
  : false;

const config: DataSourceOptions = {
  type: 'postgres',
  schema: process.env.DATABASE_SCHEMA || 'public',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'mantra',
  password: process.env.DATABASE_PASSWORD || 'mantra',
  database: process.env.DATABASE_NAME || 'mantra_quest_handler',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: logging,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  migrationsRun: process.env.DATABASE_AUTO_RUN_MIGRATIONS === 'true',
  maxQueryExecutionTime: 2000,
};

export default registerAs('typeorm', () => config);
export const dataSource = new DataSource(config);
