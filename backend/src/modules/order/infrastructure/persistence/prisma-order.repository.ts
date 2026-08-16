import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { Product } from '../../../product/domain/entities/product.entity';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.vo';
import { OrderMapper } from './order.mapper';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: OrderId): Promise<Order | null> {
    const raw = await this.prisma.client.order.findUnique({
      where: { id: id.getValue() },
      include: { orderItems: true },
    });
    return raw ? OrderMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<Order[]> {
    const raws = await this.prisma.client.order.findMany({
      include: { orderItems: true },
    });
    return raws.map(OrderMapper.toDomain);
  }

  async createWithStockUpdate(
    order: Order,
    updatedProducts: Product[],
  ): Promise<void> {
    await this.prisma.client.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          id: order.id.getValue(),
          userId: order.userId,
          orderItems: {
            create: order.items.map((item) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      for (const product of updatedProducts) {
        await tx.product.update({
          where: { id: product.id.getValue() },
          data: { stock: product.stock },
        });
      }
    });
  }
}
