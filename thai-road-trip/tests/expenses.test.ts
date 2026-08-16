import { describe, expect, it } from 'vitest';
import { computeExpenseStats } from '@/services/expenses';
import type { Expense } from '@/types';

const exp = (amount: number, category: Expense['category'], date: string): Expense => ({
  id: `${category}-${amount}-${date}`,
  amount,
  category,
  date,
  createdAt: `${date}T10:00:00Z`,
});

describe('statistiques de dépenses', () => {
  it('calcule aujourd’hui, total et moyenne par jour', () => {
    const expenses = [
      exp(100, 'nourriture', '2026-08-30'),
      exp(300, 'logement', '2026-08-30'),
      exp(200, 'essence', '2026-08-31'),
    ];
    const stats = computeExpenseStats(expenses, '2026-08-31');
    expect(stats.total).toBe(600);
    expect(stats.today).toBe(200);
    expect(stats.perDay).toBe(300); // 600 / 2 jours
  });

  it('répartit par catégorie avec pourcentages triés', () => {
    const expenses = [
      exp(100, 'nourriture', '2026-08-30'),
      exp(300, 'logement', '2026-08-30'),
      exp(100, 'nourriture', '2026-08-31'),
    ];
    const stats = computeExpenseStats(expenses, '2026-08-31');
    expect(stats.byCategory[0]).toMatchObject({ category: 'logement', total: 300, percent: 60 });
    expect(stats.byCategory[1]).toMatchObject({ category: 'nourriture', total: 200, percent: 40 });
  });

  it('gère l’absence de dépenses', () => {
    const stats = computeExpenseStats([], '2026-08-30');
    expect(stats.total).toBe(0);
    expect(stats.perDay).toBe(0);
    expect(stats.byCategory).toHaveLength(0);
  });
});
