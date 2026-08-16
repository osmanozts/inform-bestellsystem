import { ProductDto } from './product.dto';

export interface PaginatedProductsDto {
  data: ProductDto[];
  total: number;
  page: number;
  limit: number;
}
