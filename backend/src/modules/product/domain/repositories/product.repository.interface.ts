import { Product } from '../entities/product.entity';
import { ProductId } from '../value-objects/product-id.vo';

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

export interface IProductRepository {
  findById(id: ProductId): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<void>;
  delete(id: ProductId): Promise<void>;
}
