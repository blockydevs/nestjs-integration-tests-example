import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { HttpModule } from '@nestjs/axios';
import { OrderModule } from '../order/order.module';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { CartService } from './cart.service';
import { StoreManagerModule } from '../store-manager/store-manager.module';

@Module({
  imports: [
    HttpModule,
    OrderModule,
    CartModule,
    CustomerModule,
    ProductModule,
    CustomerModule,
    StoreManagerModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
