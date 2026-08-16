import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../../product/domain/entities/product.entity';
import { OrderProductNotFoundError } from '../../domain/errors/order.errors';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../product/domain/repositories/product.repository.interface';
import { ProductId } from '../../../product/domain/value-objects/product-id.vo';
import { Order } from '../../domain/entities/order.entity';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderDto } from '../dtos/order.dto';
import { toOrderDto } from './order.mapper';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderDto> {
    const products = await Promise.all(
      dto.items.map((item) =>
        this.productRepository.findById(ProductId.create(item.productId)),
      ),
    );

    for (let i = 0; i < products.length; i++) {
      if (!products[i]) {
        throw new OrderProductNotFoundError(dto.items[i]!.productId);
      }
    }

    const order = Order.create(
      {
        id: crypto.randomUUID(),
        userId: dto.userId,
        items: dto.items,
      },
      products as Product[],
    );

    await this.orderRepository.createWithStockUpdate(
      order,
      products as Product[],
    );

    return toOrderDto(order);
  }
}
