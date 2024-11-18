import { Product } from '../product/product.interface';
import { Cart } from '../cart/cart.interface';

export interface StoreManagerPort {
  getCartData(cartId: string): Promise<Cart>;
  getProductData(productId: string): Promise<Product>;
}

export const StoreManagerPort = Symbol('StoreManagerPort');
