import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '06e398b3-51ea-4d06-b96e-20ac164d3f0d',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product Price',
    default: 0,
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'A cool t-shirt',
    description: 'Product Description',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 't-shirt_teslo',
    description: 'Product Slug',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 0,
    description: 'Product Stock',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'Product Sizes',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'unisex',
    description: 'Product Gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['clothing', 't-shirt'],
    description: 'Product Tags',
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiProperty({})
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.convertToSlug(this.slug);
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.convertToSlug(this.slug);
  }

  private convertToSlug(slug: string) {
    return slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }
}
