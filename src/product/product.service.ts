import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Product } from './product.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(private readonly httpService: HttpService) {}

  public async getProductData(productId: number): Promise<Product> {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://fakestoreapi.com/products/${productId}`),
    );
    return data;
  }
}
