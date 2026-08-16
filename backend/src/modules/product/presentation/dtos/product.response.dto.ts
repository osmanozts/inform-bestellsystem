import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../../application/dtos/product.dto';

export class ProductResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'MacBook Pro 14"' })
  name!: string;

  @ApiProperty({ example: 1999.99 })
  price!: number;

  @ApiProperty({ example: 15 })
  stock!: number;

  static from(dto: ProductDto): ProductResponseDto {
    const response = new ProductResponseDto();
    response.id = dto.id;
    response.name = dto.name;
    response.price = dto.price;
    response.stock = dto.stock;
    return response;
  }
}
