import { Inject, Injectable } from '@nestjs/common';
import { OrderNotFoundError } from '../../domain/errors/order.errors';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.vo';
import { OrderDto } from '../dtos/order.dto';
import { toOrderDto } from './order.mapper';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(id: string): Promise<OrderDto> {
    const order = await this.orderRepository.findById(OrderId.create(id));

    if (!order) {
      throw new OrderNotFoundError(id);
    }

    return toOrderDto(order);
  }
}
