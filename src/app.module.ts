import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './config/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { RedisCache, redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          store: redisStore,
          database: process.env.REDIS_DEFAULT_DB || '1',
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD || '',
            ttl: parseInt(process.env.CACHE_DEFAULT_TTL || '5000'),
          },
        };
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSource.options,
    }),
    CartModule,
    ProductModule,
    OrderModule,
    CustomerModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  async onModuleDestroy() {
    await this.cacheManager.store.client.quit();
  }
}
