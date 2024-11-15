import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RedisCache, redisStore } from 'cache-manager-redis-yet';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import typeorm from './config/typeorm';
import typeorm_test from './config/typeorm-tests';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [typeorm, typeorm_test],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          database: configService.get('REDIS_DEFAULT_DB') || '1',
          socket: {
            host: configService.get('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get('REDIS_PORT') || '6379'),
            password: configService.get('REDIS_PASSWORD') || '',
            ttl: parseInt(configService.get('CACHE_DEFAULT_TTL') || '5000'),
          },
        };
      },
      isGlobal: true,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get('NODE_ENV') === 'test'
          ? configService.get('typeorm_test')
          : configService.get('typeorm');
      },
    }),
    CartModule,
    ProductModule,
    OrderModule,
    CustomerModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  async onModuleDestroy() {
    await this.cacheManager.store.client.quit();
  }
}
