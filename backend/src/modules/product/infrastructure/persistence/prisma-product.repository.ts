import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { Product } from '../../domain/entities/product.entity';
import {
  IProductRepository,
  ProductPage,
} from '../../domain/repositories/product.repository.interface';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { ProductMapper } from './product.mapper';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ProductId): Promise<Product | null> {
    const raw = await this.prisma.client.product.findUnique({
      where: { id: id.getValue() },
    });
    return raw ? ProductMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<Product[]> {
    const raws = await this.prisma.client.product.findMany();
    return raws.map(ProductMapper.toDomain);
  }

  async findPaginated(page: number, limit: number): Promise<ProductPage> {
    const skip = (page - 1) * limit;
    const [raws, total] = await Promise.all([
      this.prisma.client.product.findMany({ skip, take: limit, orderBy: { createdAt: 'asc' } }),
      this.prisma.client.product.count(),
    ]);
    return { items: raws.map(ProductMapper.toDomain), total };
  }

  async save(product: Product): Promise<void> {
    const data = ProductMapper.toPrisma(product);
    await this.prisma.client.product.upsert({
      where: { id: data.id },
      create: data,
      update: { name: data.name, price: data.price, stock: data.stock },
    });
  }

  async delete(id: ProductId): Promise<void> {
    await this.prisma.client.product.delete({
      where: { id: id.getValue() },
    });
  }
}
