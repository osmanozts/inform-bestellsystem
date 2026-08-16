import { ApiProperty } from '@nestjs/swagger';
import { PaginatedProductsDto } from '../../application/dtos/paginated-products.dto';
import { ProductResponseDto } from './product.response.dto';

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data!: ProductResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  static from(dto: PaginatedProductsDto): PaginatedProductsResponseDto {
    const response = new PaginatedProductsResponseDto();
    response.data = dto.data.map(ProductResponseDto.from);
    response.total = dto.total;
    response.page = dto.page;
    response.limit = dto.limit;
    return response;
  }
}
