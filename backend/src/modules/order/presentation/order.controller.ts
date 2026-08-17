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
  @ApiOperation({ summary: 'Bestellungen auflisten' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.listOrders.execute();
    return orders.map(OrderResponseDto.from);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bestellung per ID laden' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiNotFoundResponse({ description: 'Bestellung nicht gefunden' })
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.getOrder.execute(id);
    return OrderResponseDto.from(order);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Neue Bestellung aufgeben' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Validierungsfehler' })
  @ApiNotFoundResponse({ description: 'Produkt nicht gefunden' })
  @ApiConflictResponse({ description: 'Nicht genug Lagerbestand' })
  async create(@Body() dto: CreateOrderRequestDto): Promise<OrderResponseDto> {
    const order = await this.createOrder.execute(dto);
    return OrderResponseDto.from(order);
  }
}
