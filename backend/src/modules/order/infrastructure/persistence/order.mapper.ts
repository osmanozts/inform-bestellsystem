import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from '../../../../generated/prisma/client';
import { Order } from '../../domain/entities/order.entity';

type PrismaOrderWithItems = PrismaOrder & { orderItems: PrismaOrderItem[] };

export class OrderMapper {
  static toDomain(raw: PrismaOrderWithItems): Order {
    return Order.reconstitute({
      id: raw.id,
      userId: raw.userId,
      createdAt: raw.createdAt,
      items: raw.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
    });
  }
}
