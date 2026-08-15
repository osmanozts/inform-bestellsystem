import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository.interface';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductDto> {
    const product = Product.create({
      id: crypto.randomUUID(),
      name: dto.name,
      price: dto.price,
      stock: dto.stock,
    });

    await this.productRepository.save(product);

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
