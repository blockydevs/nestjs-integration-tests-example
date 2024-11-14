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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'date_completed',
    nullable: false,
  })
  dateCompleted: Date;

  @JoinColumn({ name: 'customer_id' })
  @ManyToOne(() => CustomerEntity)
  customer: CustomerEntity;

  @Column({ type: 'float', name: 'total_value' })
  totalValue: number;
}
