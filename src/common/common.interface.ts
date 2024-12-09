import { CustomerEntity } from '../customer/entitites/customer.entity';

export type Uuid = string;

export interface OrderSerializableEntity {
  id: string;
  cartId: string;
  customer: CustomerEntity;
  totalValue: number;
}
