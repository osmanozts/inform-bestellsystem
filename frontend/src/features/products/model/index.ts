import type { components } from '../../../shared/api/index.ts';

export type Product = components['schemas']['ProductResponseDto'];
export type CreateProductInput =
  components['schemas']['CreateProductRequestDto'];
export type UpdateProductInput =
  components['schemas']['UpdateProductRequestDto'];
