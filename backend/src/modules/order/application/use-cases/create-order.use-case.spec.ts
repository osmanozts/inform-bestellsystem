/**
 * Diese Tests zeigen den zentralen Vorteil der Onion Architecture:
 * Der Use Case lässt sich vollständig ohne NestJS-Bootstrap und ohne
 * Datenbankverbindung testen — eine einfache In-Memory-Implementierung
 * des Repository-Interfaces genügt.
 */
import { CreateOrderUseCase } from './create-order.use-case';
import {
  IProductRepository,
  ProductPage,
} from '../../../product/domain/repositories/product.repository.interface';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { Product } from '../../../product/domain/entities/product.entity';
import { Order } from '../../domain/entities/order.entity';
import { ProductId } from '../../../product/domain/value-objects/product-id.vo';
import { OrderId } from '../../domain/value-objects/order-id.vo';
import { OrderProductNotFoundError } from '../../domain/errors/order.errors';
import { InsufficientStockError } from '../../../product/domain/errors/product.errors';

class InMemoryProductRepository implements IProductRepository {
  private store: Product[] = [];

  seed(products: Product[]) {
    this.store = [...products];
  }

  async findById(id: ProductId): Promise<Product | null> {
    return this.store.find((p) => p.id.getValue() === id.getValue()) ?? null;
  }
  async findAll(): Promise<Product[]> {
    return [...this.store];
  }
  async findPaginated(): Promise<ProductPage> {
    return { items: [], total: 0 };
  }
  async save(product: Product): Promise<void> {
    const idx = this.store.findIndex((p) => p.id.getValue() === product.id.getValue());
    if (idx >= 0) this.store[idx] = product;
    else this.store.push(product);
  }
  async delete(_id: ProductId): Promise<void> {}
}

class InMemoryOrderRepository implements IOrderRepository {
  savedOrder: Order | null = null;
  savedProducts: Product[] = [];

  async findById(_id: OrderId): Promise<Order | null> {
    return null;
  }
  async findAll(): Promise<Order[]> {
    return [];
  }
  async createWithStockUpdate(order: Order, updatedProducts: Product[]): Promise<void> {
    this.savedOrder = order;
    this.savedProducts = updatedProducts;
  }
}

describe('CreateOrderUseCase', () => {
  let productRepo: InMemoryProductRepository;
  let orderRepo: InMemoryOrderRepository;
  let useCase: CreateOrderUseCase;

  const makeProduct = (id: string, price: number, stock: number) =>
    Product.create({ id, name: 'Test Product', price, stock });

  beforeEach(() => {
    productRepo = new InMemoryProductRepository();
    orderRepo = new InMemoryOrderRepository();
    useCase = new CreateOrderUseCase(orderRepo, productRepo);
  });

  it('returns an OrderDto with the correct totalPrice', async () => {
    productRepo.seed([makeProduct('p-1', 20.0, 10)]);

    const result = await useCase.execute({
      userId: 'user-1',
      items: [{ productId: 'p-1', quantity: 3 }],
    });

    expect(result.totalPrice).toBe(60.0);
    expect(result.items[0].unitPrice).toBe(20.0);
    expect(result.items[0].subtotal).toBe(60.0);
  });

  it('passes stock-updated products to the repository for the atomic write', async () => {
    productRepo.seed([makeProduct('p-1', 10.0, 5)]);

    await useCase.execute({
      userId: 'user-1',
      items: [{ productId: 'p-1', quantity: 2 }],
    });

    const updatedProduct = orderRepo.savedProducts.find((p) => p.id.getValue() === 'p-1');
    expect(updatedProduct?.stock).toBe(3);
  });

  it('throws OrderProductNotFoundError when a product does not exist in the repository', async () => {
    productRepo.seed([]);

    await expect(
      useCase.execute({ userId: 'user-1', items: [{ productId: 'unknown', quantity: 1 }] }),
    ).rejects.toThrow(OrderProductNotFoundError);
  });

  it('propagates InsufficientStockError from the domain without wrapping it', async () => {
    productRepo.seed([makeProduct('p-1', 10.0, 1)]);

    await expect(
      useCase.execute({ userId: 'user-1', items: [{ productId: 'p-1', quantity: 5 }] }),
    ).rejects.toThrow(InsufficientStockError);
  });
});
