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
import * as request from 'supertest';

describe('Integration tests CartService', () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let redisContainer: StartedRedisContainer;
  let app: INestApplication;

  beforeAll(async () => {
    ({ app, postgresContainer, redisContainer } =
      await TestIntegrationSetup.setup());

    await app.init();
  });

  describe('Test processing carts', async () => {
    it('should process cart correctly', async () => {
      const testedCartId = '1';
      const testedCustomerId = '1';

      const response = await request(app.getHttpServer())
        .post('/cart/finalize')
        .query({
          cartId: testedCartId,
        });

      const orderRepository = app.get(DataSource).getRepository(OrderEntity);
      const customerRepository = app
        .get(DataSource)
        .getRepository(CustomerEntity);

      const orders = await orderRepository.find({
        where: {
          cartId: testedCartId,
        },
      });

      const customer = await customerRepository.findOne({
        where: {
          customerId: testedCustomerId,
        },
      });

      expect(orders).toHaveLength(1);
      expect(customer).toBeTruthy();
      expect(response).toBeTruthy();
    });
  });

  afterEach(async () => {
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
