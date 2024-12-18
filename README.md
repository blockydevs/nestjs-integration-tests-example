
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
For more details, visit: [https://www.blockydevs.com/blog](https://www.blockydevs.com/blog/nestjs-integration-testing-with-testcontainers).

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

MIT License

Copyright (c) 2024, BlockyDevs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

# 🔗 Tags:

#integration_tests #nodejs #nestjs #testcontainers #backend_testing #supertest #jest
