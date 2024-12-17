import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Uuid } from '../../common/common.interface';

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ name: 'external_id', unique: true })
  externalId: string;
}
