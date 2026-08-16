import { z } from 'zod';
import type { components } from '../../../shared/api/index.ts';

export type Order = components['schemas']['OrderResponseDto'];
export type OrderItem = components['schemas']['OrderItemResponseDto'];
export type CreateOrderInput = components['schemas']['CreateOrderRequestDto'];
export type CreateOrderItemInput = components['schemas']['CreateOrderItemRequestDto'];

export function formatOrderDate(createdAt: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(createdAt));
}

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Bitte ein Produkt auswählen.'),
  quantity: z
    .number({ error: 'Bitte eine gültige Menge eingeben.' })
    .min(1, 'Menge muss mindestens 1 sein.'),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Mindestens eine Position erforderlich.'),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
