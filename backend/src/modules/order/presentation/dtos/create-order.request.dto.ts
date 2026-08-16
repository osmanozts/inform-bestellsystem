import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemRequestDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderRequestDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000001' })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ type: [CreateOrderItemRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRequestDto)
  items!: CreateOrderItemRequestDto[];
}
