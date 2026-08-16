import { z } from 'zod';
import type { components } from '../../../shared/api/index.ts';

export type Product = components['schemas']['ProductResponseDto'];
export type CreateProductInput = components['schemas']['CreateProductRequestDto'];
export type UpdateProductInput = components['schemas']['UpdateProductRequestDto'];

export const productSchema = z.object({
  name: z.string().min(1, 'Name darf nicht leer sein.'),
  price: z
    .number({ error: 'Bitte einen gültigen Preis eingeben.' })
    .min(0, 'Preis muss ≥ 0 sein.'),
  stock: z
    .number({ error: 'Bitte einen gültigen Bestand eingeben.' })
    .int('Bestand muss eine ganze Zahl sein.')
    .min(0, 'Bestand muss ≥ 0 sein.'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
