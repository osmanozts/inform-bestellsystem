// typisierter API-Client basierend auf der OpenAPI-Spec.
// Typen regenerieren: npm run generate:api (liest ../backend/openapi.json)
export { apiClient } from './client.ts';
export type { paths, components, operations } from './schema.ts';
