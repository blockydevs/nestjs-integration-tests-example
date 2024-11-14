import { Customer } from '../customer/customer.interface';

export interface OrderCreateCommand {
  cartId: string;
  dateCompleted: Date;
  customer: Customer;
  totalValue: number;
}
