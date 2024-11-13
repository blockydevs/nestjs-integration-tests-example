import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Uuid } from '../../common/common.interface';
import { ClientEntity } from '../../client/entitites/client.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'date_completed',
    nullable: false,
  })
  dateCompleted: Date;

  @JoinColumn({ name: 'client_id' })
  @ManyToOne(() => ClientEntity)
  client: ClientEntity;
}
