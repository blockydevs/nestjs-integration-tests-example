import { StoreManagerPort } from '../store-manager.port';
import { firstValueFrom } from 'rxjs';
import { Cart } from '../../cart/cart.interface';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Product } from '../../product/product.interface';

@Injectable()
export class FakeApiStoreManagerAdapter implements StoreManagerPort {
  constructor(private readonly httpService: HttpService) {}

  public async getCartData(cartId: string): Promise<Cart> {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://fakestoreapi.com/carts/${cartId}`),
    );

    return data as Cart;
  }

  public async getProductData(productId: string): Promise<Product> {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://fakestoreapi.com/products/${productId}`),
    );
    return data;
  }
}
