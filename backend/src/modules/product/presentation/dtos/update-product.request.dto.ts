import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductRequestDto {
  @ApiPropertyOptional({ example: 'MacBook Pro 16"' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 2499.99, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 10, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
