import Dexie, { type Table } from 'dexie';
import type {
  Accommodation,
  Activity,
  AppSettings,
  ChecklistItem,
  EmergencyContact,
  Expense,
  HikeSession,
  MetaRow,
  Note,
  Photo,
  Place,
  Reservation,
  RouteLeg,
  ScooterRental,
  Transport,
  TripDay,
  WeatherSnapshot,
} from '@/types';

export class TripDatabase extends Dexie {
  days!: Table<TripDay, string>;
  places!: Table<Place, string>;
  activities!: Table<Activity, string>;
  routeLegs!: Table<RouteLeg, string>;
  accommodations!: Table<Accommodation, string>;
  transports!: Table<Transport, string>;
  reservations!: Table<Reservation, string>;
  expenses!: Table<Expense, string>;
  notes!: Table<Note, string>;
  checklist!: Table<ChecklistItem, string>;
  weather!: Table<WeatherSnapshot, string>;
  scooter!: Table<ScooterRental, string>;
  hikes!: Table<HikeSession, string>;
  photos!: Table<Photo, string>;
  emergency!: Table<EmergencyContact, string>;
  settings!: Table<AppSettings, string>;
  meta!: Table<MetaRow, string>;

  constructor(name = 'thai-road-trip') {
    super(name);
    // v1 — schéma initial. Les versions suivantes ajouteront des migrations
    // sans jamais écraser les données utilisateur.
    this.version(1).stores({
      days: 'id, date, index',
      places: 'id, category, favorite, userAdded',
      activities: 'id, dayId, placeId, status, order',
      routeLegs: 'id, dayId, status, order',
      accommodations: 'id, dayId, date',
      transports: 'id, dayId, date, mode, critical',
      reservations: 'id, kind, refId',
      expenses: 'id, date, category',
      notes: 'id, date, category, favorite',
      checklist: 'id, category, order',
      weather: 'id, date',
      scooter: 'id',
      hikes: 'id, activityId',
      photos: 'id, [refType+refId]',
      emergency: 'id, order',
      settings: 'id',
      meta: 'key',
    });
  }
}

export const db = new TripDatabase();

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'app',
  theme: 'system',
  distanceUnit: 'km',
  weatherMode: 'auto',
  notificationsEnabled: false,
  gpsEnabled: true,
  includeSkippedInCatchUp: true,
  onboardingDone: false,
};
