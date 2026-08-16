import { Product } from '../../../product/domain/entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderId } from '../value-objects/order-id.vo';

export const ORDER_REPOSITORY = Symbol('IOrderRepository');

export interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  createWithStockUpdate(
    order: Order,
    updatedProducts: Product[],
  ): Promise<void>;
}
