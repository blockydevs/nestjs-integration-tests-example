import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { HttpModule } from '@nestjs/axios';
import { StoreManagerModule } from '../store-manager/store-manager.module';

@Module({
  imports: [HttpModule, StoreManagerModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
