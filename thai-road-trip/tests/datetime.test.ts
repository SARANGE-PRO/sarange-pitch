import { describe, expect, it } from 'vitest';
import {
  bangkokToday,
  currentTripDayIndex,
  daysUntilTrip,
  formatCountdown,
  minutesToHuman,
  msUntil,
  subtractMinutes,
  tripPhase,
} from '@/utils/datetime';

describe('détermination du jour courant en timezone Asia/Bangkok', () => {
  it('convertit correctement UTC → Bangkok (UTC+7)', () => {
    // 29 août 23:30 UTC = 30 août 06:30 à Bangkok
    expect(bangkokToday(new Date('2026-08-29T23:30:00Z'))).toBe('2026-08-30');
    // 30 août 16:59 UTC = 30 août 23:59 à Bangkok
    expect(bangkokToday(new Date('2026-08-30T16:59:00Z'))).toBe('2026-08-30');
    // 30 août 17:01 UTC = 31 août 00:01 à Bangkok
    expect(bangkokToday(new Date('2026-08-30T17:01:00Z'))).toBe('2026-08-31');
  });

  it('calcule le bon index de jour de voyage', () => {
    expect(currentTripDayIndex(new Date('2026-08-30T02:00:00Z'))).toBe(1);
    expect(currentTripDayIndex(new Date('2026-09-01T12:00:00Z'))).toBe(3);
    // 4 septembre à Bangkok
    expect(currentTripDayIndex(new Date('2026-09-04T05:00:00Z'))).toBe(6);
    expect(currentTripDayIndex(new Date('2026-09-05T05:00:00Z'))).toBe(7);
  });

  it('borne l’index avant et après le voyage', () => {
    expect(currentTripDayIndex(new Date('2026-08-01T00:00:00Z'))).toBe(1);
    expect(currentTripDayIndex(new Date('2026-09-20T00:00:00Z'))).toBe(7);
  });

  it('détecte la phase du voyage', () => {
    expect(tripPhase(new Date('2026-08-15T00:00:00Z'))).toBe('before');
    expect(tripPhase(new Date('2026-09-02T00:00:00Z'))).toBe('during');
    expect(tripPhase(new Date('2026-09-06T00:00:00Z'))).toBe('after');
  });

  it('compte les jours avant le départ', () => {
    expect(daysUntilTrip(new Date('2026-08-28T02:00:00Z'))).toBe(2);
    expect(daysUntilTrip(new Date('2026-09-01T02:00:00Z'))).toBe(0);
  });
});

describe('temps et durées', () => {
  it('msUntil calcule le temps restant vers un horaire Bangkok', () => {
    // vol à 10:00 Bangkok = 03:00 UTC
    const ms = msUntil('2026-09-05', '10:00', new Date('2026-09-05T01:00:00Z'));
    expect(ms).toBe(2 * 3600_000);
  });

  it('formate un compte à rebours lisible', () => {
    expect(formatCountdown(4 * 3600_000 + 20 * 60_000)).toBe('4 h 20');
    expect(formatCountdown(30 * 60_000)).toBe('30 min');
    expect(formatCountdown(-5)).toBe('maintenant');
    expect(formatCountdown(26 * 3600_000)).toBe('1 j 2 h');
  });

  it('formate les durées en heures/minutes', () => {
    expect(minutesToHuman(45)).toBe('45 min');
    expect(minutesToHuman(225)).toBe('3 h 45');
    expect(minutesToHuman(120)).toBe('2 h');
  });

  it('soustrait des minutes à une heure (départ recommandé)', () => {
    expect(subtractMinutes('10:00', 240)).toBe('06:00');
    expect(subtractMinutes('08:30', 90)).toBe('07:00');
    // passage minuit
    expect(subtractMinutes('01:00', 120)).toBe('23:00');
  });
});
