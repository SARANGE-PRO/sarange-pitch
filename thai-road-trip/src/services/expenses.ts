import type { Expense } from '@/types';

export interface ExpenseStats {
  total: number;
  today: number;
  perDay: number;
  byCategory: { category: Expense['category']; total: number; percent: number }[];
}

export function computeExpenseStats(expenses: Expense[], today: string): ExpenseStats {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const todayTotal = expenses.filter((e) => e.date === today).reduce((s, e) => s + e.amount, 0);
  const uniqueDays = new Set(expenses.map((e) => e.date)).size;
  const perDay = uniqueDays === 0 ? 0 : Math.round(total / uniqueDays);
  const map = new Map<Expense['category'], number>();
  for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  const byCategory = [...map.entries()]
    .map(([category, catTotal]) => ({
      category,
      total: catTotal,
      percent: total === 0 ? 0 : Math.round((catTotal / total) * 100),
    }))
    .sort((a, b) => b.total - a.total);
  return { total, today: todayTotal, perDay, byCategory };
}

export const EXPENSE_CATEGORY_LABELS: Record<Expense['category'], string> = {
  logement: 'Logement',
  nourriture: 'Nourriture',
  scooter: 'Scooter',
  essence: 'Essence',
  avion: 'Avion',
  transport: 'Transport',
  temples: 'Temples',
  activites: 'Activités',
  shopping: 'Shopping',
  autre: 'Autre',
};
