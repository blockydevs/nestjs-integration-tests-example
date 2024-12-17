import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entitites/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerEntityRepository: Repository<CustomerEntity>,
  ) {}

  public async getOrCreateCustomerById(
    customerId: string,
  ): Promise<CustomerEntity> {
    let customer: CustomerEntity = await this.customerEntityRepository.findOne({
      where: { externalId: customerId },
    });

    if (!customer) {
      customer = this.customerEntityRepository.create({
        externalId: customerId,
      });
      customer = await this.customerEntityRepository.save(customer);
    }

    return customer;
  }
}
