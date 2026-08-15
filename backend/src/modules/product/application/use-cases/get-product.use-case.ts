import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductNotFoundError } from '../../domain/errors/product.errors';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { ProductDto } from '../dtos/product.dto';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<ProductDto> {
    const product = await this.productRepository.findById(
      ProductId.create(id),
    );

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    return toProductDto(product);
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
