import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { ProductDto } from '../dtos/product.dto';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<ProductDto[]> {
    const products = await this.productRepository.findAll();
    return products.map(toProductDto);
  }
}

function toProductDto(product: Product): ProductDto {
  return {
    id: product.id.getValue(),
    name: product.name,
    price: product.price.getAmount(),
    stock: product.stock,
  };
}
