import { describe } from 'node:test';
import { TestIntegrationSetup } from './test-integration-setup';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedRedisContainer } from '@testcontainers/redis';
import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TestIntegrationTeardown } from './test-integration-teardown';
import { OrderEntity } from '../src/order/entities/order.entity';
import { CustomerEntity } from '../src/customer/entitites/customer.entity';
import * as request from 'supertest';

describe('Integration tests CartService', () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let redisContainer: StartedRedisContainer;
  let app: INestApplication;
  let orderRepository: Repository<OrderEntity>;
  let customerRepository: Repository<CustomerEntity>;

  beforeAll(async () => {
    ({ app, postgresContainer, redisContainer } =
      await TestIntegrationSetup.setup());

    await app.init();

    orderRepository = app.get(DataSource).getRepository(OrderEntity);
    customerRepository = app.get(DataSource).getRepository(CustomerEntity);
  });

  describe('Test processing carts', async () => {
    it('should process cart correctly when customer is not present in the DB', async () => {
      const testedCartId = '1';
      const testedCustomerId = '1';

      const response = await request(app.getHttpServer())
        .post('/cart/finalize')
        .query({
          cartId: testedCartId,
        });

      const orders = await orderRepository.find({
        where: {
          cartId: testedCartId,
        },
      });

      const customer = await customerRepository.findOne({
        where: {
          externalId: testedCustomerId,
        },
      });

      expect(orders).toHaveLength(1);
      expect(customer).toBeTruthy();
      expect(response).toBeTruthy();
    });

    it('should return error status when the cart has been processed already', async () => {
      const testedCartId = '1';
      const testedCustomerId = '1';

      await orderRepository.insert({
        cartId: testedCartId,
        customer: new CustomerEntity(),
        totalValue: BigInt(123),
      });

      await customerRepository.insert({
        externalId: testedCustomerId,
      });

      const response = await request(app.getHttpServer())
        .post('/cart/finalize')
        .query({
          cartId: testedCartId,
        });

      const orders = await orderRepository.find({
        where: {
          cartId: testedCartId,
        },
      });

      const customer = await customerRepository.findOne({
        where: {
          externalId: testedCustomerId,
        },
      });

      const responseData = JSON.parse(response.text);

      expect(orders).toHaveLength(1);
      expect(customer).toBeTruthy();
      expect(responseData).toHaveProperty(
        'message',
        `Order with cartId ${testedCartId} has already been processed.`,
      );
      expect(responseData).toHaveProperty('statusCode', 409);
    });

    it('should process cart correctly when customer is in the DB', async () => {
      const testedCartId = '1';
      const testedCustomerId = '1';

      await customerRepository.insert({
        externalId: testedCustomerId,
      });

      const response = await request(app.getHttpServer())
        .post('/cart/finalize')
        .query({
          cartId: testedCartId,
        });

      const orders = await orderRepository.find({
        where: {
          cartId: testedCartId,
        },
      });

      const customer = await customerRepository.findOne({
        where: {
          externalId: testedCustomerId,
        },
      });

      const responseData = JSON.parse(response.text);

      expect(orders).toHaveLength(1);
      expect(customer).toBeTruthy();
      expect(responseData).toBeTruthy();
    });

    it('should return error status when the cart data cannot be fetched', async () => {
      const testedCartId = '1000';
      const testedCustomerId = '1';

      await customerRepository.insert({
        externalId: testedCustomerId,
      });

      const response = await request(app.getHttpServer())
        .post('/cart/finalize')
        .query({
          cartId: testedCartId,
        });

      const orders = await orderRepository.find({
        where: {
          cartId: testedCartId,
        },
      });

      const customer = await customerRepository.findOne({
        where: {
          externalId: testedCustomerId,
        },
      });

      const responseData = JSON.parse(response.text);

      expect(orders).toHaveLength(0);
      expect(customer).toBeTruthy();
      expect(responseData).toHaveProperty(
        'message',
        `Cart with id ${testedCartId} not found in the external API.`,
      );
      expect(responseData).toHaveProperty('statusCode', 404);
    });

    it('should return error status when cant fetch product data', async () => {
      const testedCartId = '10';
      const testedCustomerId = '11';
      const invalidProductId = '1000';

      const response = await request(app.getHttpServer())
        .post('/cart/finalize')
        .query({
          cartId: testedCartId,
        });

      const orders = await orderRepository.find({
        where: {
          cartId: testedCartId,
        },
      });

      const customer = await customerRepository.findOne({
        where: {
          externalId: testedCustomerId,
        },
      });

      const responseData = JSON.parse(response.text);

      expect(orders).toHaveLength(0);
      expect(customer).toBeFalsy();
      expect(responseData).toHaveProperty(
        'message',
        `Product with id ${invalidProductId} not found in the external API.`,
      );
      expect(responseData).toHaveProperty('statusCode', 404);
    });

    it('should return error status when cart is empty', async () => {
      const testedCartId = '11';
      const testedCustomerId = '11';

      const response = await request(app.getHttpServer())
        .post('/cart/finalize')
        .query({
          cartId: testedCartId,
        });

      const orders = await orderRepository.find({
        where: {
          cartId: testedCartId,
        },
      });

      const customer = await customerRepository.findOne({
        where: {
          externalId: testedCustomerId,
        },
      });

      const responseData = JSON.parse(response.text);

      expect(orders).toHaveLength(0);
      expect(customer).toBeFalsy();
      expect(responseData).toHaveProperty(
        'message',
        `Cannot complete transaction for empty cart: ${testedCartId}`,
      );
      expect(responseData).toHaveProperty('statusCode', 400);
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
