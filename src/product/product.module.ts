import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
