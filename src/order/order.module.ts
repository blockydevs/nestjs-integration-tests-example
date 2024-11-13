import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientModule } from '../client/client.module';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), ClientModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
