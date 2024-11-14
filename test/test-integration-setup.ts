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
import { MockProductService } from '../src/product/mocks/mock-product.service';
import { ProductService } from '../src/product/product.service';
import { CartService } from '../src/cart/cart.service';
import { MockCartService } from '../src/cart/mocks/mock-cart.service';

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
      .overrideProvider(ProductService)
      .useClass(MockProductService)
      .overrideProvider(CartService)
      .useClass(MockCartService)
      .compile();

    const app: INestApplication = moduleFixture.createNestApplication();

    return { postgresContainer, redisContainer, app };
  }
}
