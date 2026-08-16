export function formatTHB(amount: number): string {
  return `${amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} ฿`;
}

export function formatKm(km: number, unit: 'km' | 'mi' = 'km'): string {
  if (unit === 'mi') return `${Math.round(km * 0.621371)} mi`;
  return `${Math.round(km)} km`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function percent(done: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}
