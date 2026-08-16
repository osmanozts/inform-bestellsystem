import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductRequestDto {
  @ApiProperty({ example: 'MacBook Pro 14"' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1999.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 15, minimum: 0 })
  @IsNumber()
  @Min(0)
  stock!: number;
}
