import { ApiProperty } from '@nestjs/swagger';
import { OrderDto } from '../../application/dtos/order.dto';

export class OrderItemResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440010' })
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  productId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: 999.99 })
  unitPrice!: number;

  @ApiProperty({ example: 1999.98 })
  subtotal!: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440020' })
  id!: string;

  @ApiProperty({ example: '00000000-0000-0000-0000-000000000001' })
  userId!: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];

  @ApiProperty({ example: 1999.98 })
  totalPrice!: number;

  @ApiProperty({ example: '2026-08-16T10:00:00.000Z' })
  createdAt!: string;

  static from(dto: OrderDto): OrderResponseDto {
    const response = new OrderResponseDto();
    response.id = dto.id;
    response.userId = dto.userId;
    response.totalPrice = dto.totalPrice;
    response.createdAt = dto.createdAt;
    response.items = dto.items.map((item) => {
      const itemResponse = new OrderItemResponseDto();
      itemResponse.id = item.id;
      itemResponse.productId = item.productId;
      itemResponse.quantity = item.quantity;
      itemResponse.unitPrice = item.unitPrice;
      itemResponse.subtotal = item.subtotal;
      return itemResponse;
    });
    return response;
  }
}
