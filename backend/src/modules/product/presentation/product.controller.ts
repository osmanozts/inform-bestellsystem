import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { CreateProductRequestDto } from './dtos/create-product.request.dto';
import { ListProductsQueryDto } from './dtos/list-products.query.dto';
import { PaginatedProductsResponseDto } from './dtos/paginated-products.response.dto';
import { ProductResponseDto } from './dtos/product.response.dto';
import { UpdateProductRequestDto } from './dtos/update-product.request.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Produkte paginiert auflisten' })
  @ApiResponse({ status: 200, type: PaginatedProductsResponseDto })
  async findAll(@Query() query: ListProductsQueryDto): Promise<PaginatedProductsResponseDto> {
    const result = await this.listProducts.execute(query.page, query.limit);
    return PaginatedProductsResponseDto.from(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Produkt per ID laden' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Produkt nicht gefunden' })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.getProduct.execute(id);
    return ProductResponseDto.from(product);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Neues Produkt anlegen' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Validierungsfehler' })
  async create(@Body() dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    const product = await this.createProduct.execute(dto);
    return ProductResponseDto.from(product);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Produkt aktualisieren' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Produkt nicht gefunden' })
  @ApiResponse({ status: 400, description: 'Validierungsfehler' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProduct.execute(id, dto);
    return ProductResponseDto.from(product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Produkt löschen' })
  @ApiNoContentResponse({ description: 'Erfolgreich gelöscht' })
  @ApiNotFoundResponse({ description: 'Produkt nicht gefunden' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProduct.execute(id);
  }
}
