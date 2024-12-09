import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedRedisContainer } from '@testcontainers/redis';

import { INestApplication, Logger } from '@nestjs/common';

import { DataSource } from 'typeorm';

export class TestIntegrationTeardown {
  private static readonly logger = new Logger(TestIntegrationTeardown.name);

  public static async teardown(
    app: INestApplication,
    postgresContainer: StartedPostgreSqlContainer,
    redisContainer: StartedRedisContainer,
  ): Promise<void> {
    try {
      await app.get(DataSource).destroy();

      await app.close();

      await postgresContainer.stop();
      await redisContainer.stop();
    } catch (error) {
      this.logger.error('Error during teardown:', error);
      throw error;
    }
  }
}
