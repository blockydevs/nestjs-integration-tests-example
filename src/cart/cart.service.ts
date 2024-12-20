import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from './cart.interface';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { CustomerService } from '../customer/customer.service';
import { CustomerEntity } from '../customer/entitites/customer.entity';
import { RedisCache } from 'cache-manager-redis-yet';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { StoreManagerPort } from '../store-manager/store-manager.port';
import { Utils } from '../utils/utils';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    @Inject(StoreManagerPort)
    private readonly storeManagerPort: StoreManagerPort,
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
  ) {}

  public async getCartData(cartId: string): Promise<Cart> {
    const cachedData = await this.cacheManager.get<Cart>(cartId);

    if (cachedData) {
      this.logger.log(`Reading cart data for cartId(CACHED): ${cartId}`);
      return cachedData;
    }

    const cartData = await this.storeManagerPort.getCartData(cartId);

    if (!cartData) {
      throw new NotFoundException(
        `Cart with id ${cartId} not found in the external API.`,
      );
    }

    await this.cacheManager.set(cartId, cartData);

    return cartData;
  }

  public async finalizeCart(cartId: string) {
    const existingOrder = await this.orderService.findOrderByCartId(cartId);
    if (existingOrder) {
      throw new ConflictException(
        `Order with cartId ${cartId} has already been processed.`,
      );
    }

    const cartData: Cart = await this.getCartData(cartId);
    let cartValue: bigint = BigInt(0);

    if (cartData.products.length === 0) {
      throw new BadRequestException(
        `Cannot complete transaction for empty cart: ${cartId}`,
      );
    }

    const productPrices = await Promise.all(
      cartData.products.map((product) =>
        this.productService.getProductData(product.productId),
      ),
    );

    cartValue = productPrices.reduce(
      (acc, product) => acc + Utils.toCents(product.price),
      BigInt(0),
    );

    this.logger.log(`Cart ${cartId} has total value of: ${cartValue}`);

    const customerEntity: CustomerEntity =
      await this.customerService.getOrCreateCustomerById(
        cartData.userId.toString(),
      );

    return await this.orderService.saveOrder({
      cartId: cartId,
      customer: customerEntity,
      totalValue: cartValue,
    });
  }
}
