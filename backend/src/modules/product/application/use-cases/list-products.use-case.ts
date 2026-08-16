import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { PaginatedProductsDto } from '../dtos/paginated-products.dto';
import { ProductDto } from '../dtos/product.dto';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(page: number, limit: number): Promise<PaginatedProductsDto> {
    const { items, total } = await this.productRepository.findPaginated(page, limit);
    return {
      data: items.map(toProductDto),
      total,
      page,
      limit,
    };
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
