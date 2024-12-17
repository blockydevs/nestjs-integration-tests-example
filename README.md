
![Logo](https://media.licdn.com/dms/image/v2/D4D0BAQHiTr61nk0xfA/company-logo_200_200/company-logo_200_200/0/1667558457062/blockydevs_logo?e=1742428800&v=beta&t=NP8GFLPdcBKAcCO8r1kLI2XEV7tHfawzrBW_vDTx-bU)


# Nest.js integration tests example

This project demonstrates how to set up and perform integration tests in a Nest.js application using the *Testcontainers* library for service containerization.


## 🛠️ Technologies Used
- *Nest.js* - Backend framework
- *PostgreSQL* - Relational database
- *Redis* - Caching service
- *Testcontainers* - For containerized testing
- *Jest* - Testing framework
- *Supertest* - API testing utility

## 📦 External dependencies
The project relies on the external API *Fake Store API* for data.
More details can be found at: https://fakestoreapi.com/.

## 📝 Article
This repository accompanies an article explaining the integration testing setup in Nest.js.
For more details, visit: https://www.blockydevs.com/blog.

## 🚀 Usage

### Starting the Application

```bash
npm run start
```
### Running Integration Tests

```bash
npm run test:integration
```


## 📘 API Reference

#### Finalize cart

```http
  POST /cart/finalize
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :---------------------------------------|
| `cartId` | `number` | **Required**. Id of cart to be finalized |

#### Get cart data

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of cart to fetch |



## ✅ Example Test Case

Here's an example integration test for processing a cart:

``` TS
describe('CartService Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await TestIntegrationSetup.setup());
    await app.init();
  });

  it('should finalize a cart correctly', async () => {
    const response = await request(app.getHttpServer())
      .post('/cart/finalize')
      .query({ cartId: '1' });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  afterAll(async () => {
    await TestIntegrationTeardown.teardown(app);
  });
});
```

## 📜 License

[MIT](https://choosealicense.com/licenses/mit/)


# 🔗 Tags:

#integration_tests #nodejs #nestjs #testcontainers #backend_testing #supertest #jest
