import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Uuid } from '../../common/common.interface';

@Entity('client')
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ name: 'client_id', unique: true })
  clientId: string;
}
