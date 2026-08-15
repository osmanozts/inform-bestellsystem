import { Product as PrismaProduct } from '../../../../generated/prisma/client';
import { Product } from '../../domain/entities/product.entity';

export class ProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create({
      id: raw.id,
      name: raw.name,
      price: Number(raw.price),
      stock: raw.stock,
    });
  }

  static toPrisma(product: Product): {
    id: string;
    name: string;
    price: number;
    stock: number;
  } {
    return {
      id: product.id.getValue(),
      name: product.name,
      price: product.price.getAmount(),
      stock: product.stock,
    };
  }
}
