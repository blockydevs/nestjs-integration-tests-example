import { Controller, Get, Post, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.interface';
import { OrderEntity } from '../order/entities/order.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  public async getCart(@Query('cartId') cartId: string): Promise<Cart> {
    return await this.cartService.getCartData(cartId);
  }

  @Post('/finalize')
  public async finalizeCart(
    @Query('cartId') cartId: string,
  ): Promise<OrderEntity> {
    return await this.cartService.finalizeCart(cartId);
  }
}
