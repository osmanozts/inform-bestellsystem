import { Product } from '../entities/product.entity';
import { ProductId } from '../value-objects/product-id.vo';

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

export interface ProductPage {
  items: Product[];
  total: number;
}

export interface IProductRepository {
  findById(id: ProductId): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findPaginated(page: number, limit: number): Promise<ProductPage>;
  save(product: Product): Promise<void>;
  delete(id: ProductId): Promise<void>;
}
