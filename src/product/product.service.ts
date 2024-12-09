import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Product } from './product.interface';
import { StoreManagerPort } from '../store-manager/store-manager.port';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject(StoreManagerPort)
    private readonly storeManagerPort: StoreManagerPort,
  ) {}

  public async getProductData(productId: number): Promise<Product> {
    const productData = await this.storeManagerPort.getProductData(
      productId.toString(),
    );
    if (!productData) {
      this.logger.log(`Product ${productId} not found`);
      throw new NotFoundException(
        `Product with id ${productId} not found in the external API.`,
      );
    }

    return productData;
  }
}
