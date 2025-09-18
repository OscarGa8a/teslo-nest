import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductService) {}

  async executeSeed() {
    await this.insertNewProducts();
    return 'EXECUTE SEED';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = products.map((product) =>
      this.productsService.create(product),
    );
    await Promise.all(insertPromises);
  }
}
