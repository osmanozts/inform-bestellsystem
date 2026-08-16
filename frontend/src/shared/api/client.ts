import createClient from 'openapi-fetch';
import type { paths } from './schema.ts';

const baseUrl = import.meta.env['VITE_API_BASE_URL'] as string | undefined;

if (!baseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined. Add it to .env.local.');
}

export const apiClient = createClient<paths>({ baseUrl });
