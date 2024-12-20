import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

dotenv.config({ path: '.env.integration', override: true });
jest.setTimeout(30000); // testcontainers require longer timeout for setup

export class TestIntegrationSetup {
  public static async setup(): Promise<{
    app: INestApplication;
    postgresContainer: StartedPostgreSqlContainer;
    redisContainer: StartedRedisContainer;
  }> {
    const postgresContainer: StartedPostgreSqlContainer =
      await new PostgreSqlContainer().start();

    const redisContainer: StartedRedisContainer =
      await new RedisContainer().start();

    process.env.DATABASE_HOST = postgresContainer.getHost();
    process.env.DATABASE_PORT = postgresContainer.getPort().toString();
    process.env.DATABASE_USERNAME = postgresContainer.getUsername();
    process.env.DATABASE_PASSWORD = postgresContainer.getPassword();
    process.env.DATABASE_NAME = postgresContainer.getDatabase();

    process.env.REDIS_HOST = redisContainer.getHost();
    process.env.REDIS_PORT = redisContainer.getPort().toString();
    process.env.REDIS_PASSWORD = redisContainer.getPassword();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          if (key === 'typeorm_test') {
            return {
              type: 'postgres',
              host: postgresContainer.getHost(),
              port: postgresContainer.getPort(),
              username: postgresContainer.getUsername(),
              password: postgresContainer.getPassword(),
              database: postgresContainer.getDatabase(),
              entities: ['./src/**/*.entity{.ts,.js}'],
              migrations: ['./src/migrations/*{.ts,.js}'],
              migrationsRun: true,
              logging: true,
              retryAttempts: 3,
              keepConnectionAlive: false,
            };
          }
          const value = process.env[key];
          if (value === undefined) {
            throw new Error(`Environment variable ${key} not found`);
          }
          return process.env[key];
        },
      })
      .compile();

    const app: INestApplication = moduleFixture.createNestApplication();

    return { postgresContainer, redisContainer, app };
  }
}
