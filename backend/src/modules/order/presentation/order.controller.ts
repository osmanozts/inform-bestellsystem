import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderDto } from '../application/dtos/order.dto';
import { CreateOrderUseCase } from '../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../application/use-cases/list-orders.use-case';
import { CreateOrderRequestDto } from './dtos/create-order.request.dto';
import { OrderResponseDto } from './dtos/order.response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'All orders' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.listOrders.execute();
    return orders.map(OrderResponseDto.from);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Order by ID' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.getOrder.execute(id);
    return OrderResponseDto.from(order);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Place a new order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiConflictResponse({ description: 'Insufficient stock' })
  async create(@Body() dto: CreateOrderRequestDto): Promise<OrderDto> {
    return this.createOrder.execute(dto);
  }
}
