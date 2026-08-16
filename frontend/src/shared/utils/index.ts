export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';
