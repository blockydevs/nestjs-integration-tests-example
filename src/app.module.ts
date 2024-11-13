import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ClientModule } from './client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './config/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSource.options,
    }),
    CartModule,
    ProductModule,
    OrderModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
