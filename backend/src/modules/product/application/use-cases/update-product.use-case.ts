import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductNotFoundError } from '../../domain/errors/product.errors';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { ProductDto } from '../dtos/product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ProductDto> {
    const existing = await this.productRepository.findById(
      ProductId.create(id),
    );

    if (!existing) {
      throw new ProductNotFoundError(id);
    }

    const updated = Product.create({
      id: existing.id.getValue(),
      name: dto.name ?? existing.name,
      price: dto.price ?? existing.price.getAmount(),
      stock: dto.stock ?? existing.stock,
    });

    await this.productRepository.save(updated);

    return toProductDto(updated);
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
