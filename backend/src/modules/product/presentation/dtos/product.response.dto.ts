import { ProductDto } from '../../application/dtos/product.dto';

export class ProductResponseDto {
  id!: string;
  name!: string;
  price!: number;
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
