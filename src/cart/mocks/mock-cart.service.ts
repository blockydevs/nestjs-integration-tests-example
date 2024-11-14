import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from '../cart.interface';
import { ProductService } from '../../product/product.service';
import { OrderService } from '../../order/order.service';
import { CustomerService } from '../../customer/customer.service';
import { CustomerEntity } from '../../customer/entitites/customer.entity';
import { RedisCache } from 'cache-manager-redis-yet';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class MockCartService {
  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
  ) {}

  public async getCartData(cartId: string): Promise<Cart> {
    const cachedData = await this.cacheManager.get<Cart>(cartId);

    if (cachedData) {
      console.log(`Reading cart data for cartId(CACHED): ${cartId}`);
      return cachedData;
    }

    const { data } = await this.getMockData(cartId);

    if (!data) {
      throw new NotFoundException(
        `Cart with id ${cartId} not found in the external API.`,
      );
    }

    await this.cacheManager.set(cartId, data as Cart);

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

  private async getMockData(cartId: string): Promise<{ data: any } | null> {
    const fullPath = path.join(__dirname, 'cart', `${cartId}.json`);
    try {
      const data = await fs.readFile(fullPath, 'utf-8');
      console.log(`Found data: ${JSON.stringify(JSON.parse(data), null, 2)}`);
      return { data: JSON.parse(data) };
    } catch (e) {
      console.error(
        `Error reading cart (id: ${cartId}) JSON file: ${e.message}`,
      );
      return null;
    }
  }

}
