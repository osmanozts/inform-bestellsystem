import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order.repository.interface';
import { OrderDto } from '../dtos/order.dto';
import { toOrderDto } from './order.mapper';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findAll();
    return orders.map(toOrderDto);
  }
}
