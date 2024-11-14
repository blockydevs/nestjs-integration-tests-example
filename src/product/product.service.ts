import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Product } from './product.interface';

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
