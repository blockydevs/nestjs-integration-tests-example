import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entitites/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
