import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { OrderDto } from '../application/dtos/order.dto';
import { CreateOrderUseCase } from '../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../application/use-cases/list-orders.use-case';
import { CreateOrderRequestDto } from './dtos/create-order.request.dto';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
  ) {}

  @Get()
  async findAll(): Promise<OrderDto[]> {
    return this.listOrders.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderDto> {
    return this.getOrder.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrderRequestDto): Promise<OrderDto> {
    return this.createOrder.execute(dto);
  }
}
