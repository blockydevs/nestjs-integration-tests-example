import { StoreManagerPort } from '../../../src/store-manager/store-manager.port';
import { Cart } from '../../../src/cart/cart.interface';

import * as path from 'path';
import { promises as fs } from 'fs';
import { Product } from '../../../src/product/product.interface';
import { Injectable, Logger } from '@nestjs/common';

enum AssetType {
  PRODUCT = 'PRODUCT',
  CART = 'CART',
}

@Injectable()
export class MockStoreManagerAdapter implements StoreManagerPort {
  private readonly logger = new Logger(MockStoreManagerAdapter.name);

  public async getCartData(cartId: string): Promise<Cart> {
    const { data } = await this.getMockData(cartId, AssetType.CART);

    return data;
  }

  public async getProductData(productId: string): Promise<Product> {
    const { data } = await this.getMockData(productId, AssetType.PRODUCT);

    return data;
  }

  private async getMockData(id: string, assetType: AssetType): Promise<any> {
    let fullPath: string;

    if (assetType === AssetType.CART) {
      fullPath = path.join(__dirname, 'cart', `${id}.json`);
    } else {
      fullPath = path.join(__dirname, 'product', `${id}.json`);
    }

    try {
      const data = await fs.readFile(fullPath, 'utf-8');
      this.logger.log(
        `Found data: ${JSON.stringify(JSON.parse(data), null, 2)}`,
      );
      return { data: JSON.parse(data) };
    } catch (e) {
      this.logger.error(
        `Error reading ${assetType === AssetType.CART ? 'cart' : 'product'} (id: ${id}) JSON file: ${e.message}`,
      );
      return { data: JSON.parse(null) };
    }
  }
}
