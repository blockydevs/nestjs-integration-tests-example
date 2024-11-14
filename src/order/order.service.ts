import { Injectable } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderCreateCommand } from './order.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  public async saveOrder(
    createCommand: OrderCreateCommand,
  ): Promise<OrderEntity> {
    return await this.orderRepository.save(createCommand);
  }

  public async findOrderByCartId(cartId: string): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { cartId: cartId },
    });
  }
}
