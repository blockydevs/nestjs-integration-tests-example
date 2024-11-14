import { CartProduct } from '../product/product.interface';

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}
