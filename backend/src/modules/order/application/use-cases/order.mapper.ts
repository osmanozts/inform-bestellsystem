import { Order } from '../../domain/entities/order.entity';
import { OrderDto } from '../dtos/order.dto';

export function toOrderDto(order: Order): OrderDto {
  return {
    id: order.id.getValue(),
    userId: order.userId,
    totalPrice: order.totalPrice,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
  };
}
