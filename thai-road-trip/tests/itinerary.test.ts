import { describe, expect, it } from 'vitest';
import { computeCatchUp, computeProgress } from '@/services/itinerary';
import { seedDays } from '@/data/thailandTrip2026';
import type { Activity } from '@/types';

const act = (id: string, dayId: string, status: Activity['status'], order = 1): Activity => ({
  id,
  dayId,
  title: id,
  category: 'temple',
  status,
  priority: 'high',
  weatherSensitive: false,
  order,
});

describe('génération "À rattraper" (journée joker du 4 septembre)', () => {
  it('récupère les activités reportées des jours précédents', () => {
    const activities = [
      act('a1', 'd2', 'postponed'),
      act('a2', 'd3', 'completed'),
      act('a3', 'd4', 'postponed'),
    ];
    const result = computeCatchUp(activities, seedDays, false);
    expect(result.map((a) => a.id)).toEqual(['a1', 'a3']);
  });

  it('inclut les ignorées seulement si autorisé', () => {
    const activities = [act('a1', 'd2', 'skipped'), act('a2', 'd3', 'postponed')];
    expect(computeCatchUp(activities, seedDays, false).map((a) => a.id)).toEqual(['a2']);
    expect(computeCatchUp(activities, seedDays, true).map((a) => a.id)).toEqual(['a1', 'a2']);
  });

  it('exclut la journée joker elle-même et le jour suivant', () => {
    const activities = [act('a1', 'd6', 'postponed'), act('a2', 'd7', 'postponed')];
    expect(computeCatchUp(activities, seedDays, true)).toHaveLength(0);
  });

  it('trie par date d’origine', () => {
    const activities = [act('late', 'd5', 'postponed'), act('early', 'd1', 'postponed')];
    expect(computeCatchUp(activities, seedDays, false).map((a) => a.id)).toEqual(['early', 'late']);
  });
});

describe('progression d’une journée', () => {
  it('calcule le pourcentage sur les activités pertinentes', () => {
    const activities = [
      act('a1', 'd1', 'completed'),
      act('a2', 'd1', 'planned'),
      act('a3', 'd1', 'skipped'),
      act('a4', 'd1', 'postponed'),
    ];
    const p = computeProgress(activities);
    // skipped / postponed exclues du total
    expect(p.total).toBe(2);
    expect(p.done).toBe(1);
    expect(p.percent).toBe(50);
  });

  it('gère une journée vide', () => {
    expect(computeProgress([])).toEqual({ total: 0, done: 0, percent: 0 });
  });
});
