import { Module } from '@nestjs/common';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository.interface';
import { ProductController } from '../presentation/product.controller';
import { PrismaProductRepository } from './persistence/prisma-product.repository';

const useCases = [
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
];

@Module({
  controllers: [ProductController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
    ...useCases,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}
