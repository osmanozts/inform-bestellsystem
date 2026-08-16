import { apiClient } from '../../../shared/api/index.ts';
import type {
  Product,
  ProductPage,
  CreateProductInput,
  UpdateProductInput,
} from '../model/index.ts';

export async function fetchProducts(page: number, limit: number): Promise<ProductPage> {
  const { data, error } = await apiClient.GET('/products', {
    params: { query: { page, limit } },
  });
  if (error || !data) throw new Error('Produkte konnten nicht geladen werden.');
  return data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data, error } = await apiClient.GET('/products/{id}', {
    params: { path: { id } },
  });
  if (error || !data) throw new Error(`Produkt "${id}" nicht gefunden.`);
  return data;
}

export async function createProduct(body: CreateProductInput): Promise<Product> {
  const { data, error } = await apiClient.POST('/products', { body });
  if (error || !data) throw new Error('Produkt konnte nicht angelegt werden.');
  return data;
}

export async function updateProduct(id: string, body: UpdateProductInput): Promise<Product> {
  const { data, error } = await apiClient.PATCH('/products/{id}', {
    params: { path: { id } },
    body,
  });
  if (error || !data) throw new Error('Produkt konnte nicht aktualisiert werden.');
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await apiClient.DELETE('/products/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Produkt konnte nicht gelöscht werden.');
}
