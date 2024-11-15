import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../product.interface';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class MockProductService {
  constructor() {}

  public async getProductData(productId: number): Promise<Product> {
    const { data } = await this.getMockData(productId.toString());

    if (!data) {
      throw new NotFoundException(
        `Product with id ${productId} not found in the external API.`,
      );
    }
    return data;
  }

  private async getMockData(productId: string): Promise<{ data: any }> {
    const fullPath = path.join(__dirname, 'product', `${productId}.json`);
    try {
      const data = await fs.readFile(fullPath, 'utf-8');
      console.log(
        `Found product data: ${JSON.stringify(JSON.parse(data), null, 2)}`,
      );
      return { data: JSON.parse(data) };
    } catch (e) {
      console.error(
        `Error reading product (id: ${productId}) JSON file: ${e.message}`,
      );
      return { data: JSON.parse(null) };
    }
  }
}
