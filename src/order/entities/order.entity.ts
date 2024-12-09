import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Uuid } from '../../common/common.interface';
import { CustomerEntity } from '../../customer/entitites/customer.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ name: 'cart_id' })
  cartId: string;

  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => CustomerEntity)
  customer: CustomerEntity;

  @Column({ type: 'bigint', name: 'total_value' })
  totalValue: bigint;
}
