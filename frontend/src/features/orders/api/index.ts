import { apiClient } from '../../../shared/api/index.ts';
import type { Order, CreateOrderInput } from '../model/index.ts';

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await apiClient.GET('/orders');
  if (error || !data)
    throw new Error('Bestellungen konnten nicht geladen werden.');
  return data;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const { data, error } = await apiClient.GET('/orders/{id}', {
    params: { path: { id } },
  });
  if (error || !data) throw new Error(`Bestellung "${id}" nicht gefunden.`);
  return data;
}

export async function createOrder(body: CreateOrderInput): Promise<Order> {
  const { data, error } = await apiClient.POST('/orders', { body });
  if (error || !data) {
    const msg = (error as unknown as Record<string, unknown>)?.['message'];
    throw new Error(
      typeof msg === 'string'
        ? msg
        : 'Bestellung konnte nicht angelegt werden.',
    );
  }
  return data;
}
