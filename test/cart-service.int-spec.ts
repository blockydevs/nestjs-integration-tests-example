import { describe } from 'node:test';
import { TestIntegrationSetup } from './test-integration-setup';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedRedisContainer } from '@testcontainers/redis';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TestIntegrationTeardown } from './test-integration-teardown';
import { OrderEntity } from '../src/order/entities/order.entity';
import { CustomerEntity } from '../src/customer/entitites/customer.entity';
import { OrderCreateCommand } from '../src/order/order.interface';

describe('Integration tests CartService', () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let redisContainer: StartedRedisContainer;
  let app: INestApplication;

  beforeAll(async () => {
    ({ app, postgresContainer, redisContainer } =
      await TestIntegrationSetup.setup());

    await app.init();
  });

  it('Test access to postgres test container', async () => {
    const mockCustomer: CustomerEntity = new CustomerEntity();
    const mockOrder: OrderCreateCommand = {
      cartId: 'cartId',
      dateCompleted: new Date(),
      customer: mockCustomer,
      totalValue: 2137.0,
    };
    const repo = app.get(DataSource).getRepository(OrderEntity);
    let res = await repo.count();

    console.log(`Count Order entities in DB ${res}`);
    await repo.insert(mockOrder);
    res = await repo.count();
    console.log(`Count Order entities in DB ${res}`);
  });

  afterEach(async () => {
    // clean up envs
    // dotenv.config({ path: '.env.integration', override: true });

    // clean up tables and redis cache after each test
    await app.get(DataSource).getRepository(OrderEntity).delete({});
    await app.get(DataSource).getRepository(CustomerEntity).delete({});
    await app.get(CACHE_MANAGER).reset();
  });

  afterAll(async () => {
    await TestIntegrationTeardown.teardown(
      app,
      postgresContainer,
      redisContainer,
    );
  });
});
