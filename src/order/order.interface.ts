import { Customer } from '../customer/customer.interface';

export interface OrderCreateCommand {
  cartId: string;
  customer: Customer;
  totalValue: bigint;
}
