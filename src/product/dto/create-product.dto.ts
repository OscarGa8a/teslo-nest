import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Title',
    uniqueItems: true,
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product Price',
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 'A cool t-shirt',
    description: 'Product Description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 't-shirt_teslo',
    description: 'Product Slug',
    uniqueItems: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 0,
    description: 'Product Stock',
    default: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'Product Sizes',
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    example: 'unisex',
    description: 'Product Gender',
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    example: ['clothing', 't-shirt'],
    description: 'Product Tags',
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    description: 'Product Images',
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
