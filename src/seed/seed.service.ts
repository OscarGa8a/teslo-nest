import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductService) {}

  async executeSeed() {
    await this.insertNewProducts();
    return 'EXECUTE SEED';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
  }
}
