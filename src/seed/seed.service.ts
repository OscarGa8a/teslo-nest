import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ProductService } from 'src/product/product.service';
import { AuthService } from 'src/auth/auth.service';

import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductService,
    private readonly authService: AuthService,
  ) {}

  async executeSeed() {
    await this.deleteTables();

    const user = await this.insertNewUsers();
    await this.insertNewProducts(user);
    return 'EXECUTE SEED';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    await this.authService.deleteAllUsers();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;
    const userRepository = this.authService.userRepository;

    const users = seedUsers.map((user) =>
      userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      }),
    );

    await userRepository.save(users);

    return users[0];
  }

  private async insertNewProducts(user: User) {
    // await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = products.map((product) =>
      this.productsService.create(product, user),
    );
    await Promise.all(insertPromises);
  }
}
