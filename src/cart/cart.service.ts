import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cart } from './cart.interface';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { CustomerService } from '../customer/customer.service';
import { CustomerEntity } from '../customer/entitites/customer.entity';

@Injectable()
export class CartService {
  constructor(
    private readonly httpService: HttpService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
  ) {}

  public async getCartData(cartId: string): Promise<Cart> {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://fakestoreapi.com/carts/${cartId}`),
    );

    if (!data) {
      throw new NotFoundException(
        `Cart with id ${cartId} not found in the external API.`,
      );
    }

    return data as Cart;
  }

  public async finalizeCart(cartId: string) {
    const existingOrder = await this.orderService.findOrderByCartId(cartId);
    if (existingOrder) {
      throw new ConflictException(
        `Order with cartId ${cartId} has already been processed.`,
      );
    }

    const cartData: Cart = await this.getCartData(cartId);
    let cartValue: number = 0;
    for (const product of cartData.products) {
      cartValue += await this.productService
        .getProductData(product.productId)
        .then((p) => p.price);
    }
    console.log(`Cart ${cartId} has total value of: ${cartValue}`);

    if (cartValue === 0) {
      throw new Error(`Cannot complete transaction for empty cart: ${cartId}`);
    }

    const customerEntity: CustomerEntity =
      await this.customerService.getOrCreateCustomerById(
        cartData.userId.toString(),
      );

    return await this.orderService.saveOrder({
      cartId: cartId,
      dateCompleted: new Date(cartData.date),
      customer: customerEntity,
      totalValue: cartValue,
    });
  }
}