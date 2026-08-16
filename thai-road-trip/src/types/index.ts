export type ActivityStatus = 'planned' | 'in_progress' | 'completed' | 'skipped' | 'postponed';

export type Category =
  | 'temple'
  | 'hike'
  | 'waterfall'
  | 'village'
  | 'viewpoint'
  | 'food'
  | 'cafe'
  | 'hotel'
  | 'airport'
  | 'transport'
  | 'scooter'
  | 'nature'
  | 'market'
  | 'massage'
  | 'other';

export type TransportMode = 'plane' | 'scooter' | 'taxi' | 'bus' | 'train' | 'walk' | 'other';

export type Priority = 'must' | 'high' | 'normal' | 'optional';

export interface Trip {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD (Asia/Bangkok)
  endDate: string;
  timezone: string;
  currency: string;
}

export interface TripDay {
  id: string;
  tripId: string;
  date: string; // YYYY-MM-DD
  index: number; // 1-based
  title: string;
  from: string;
  to: string;
  nightPlace: string;
  summary: string;
  heavyRoadDay: boolean;
  jokerDay: boolean;
  flightDay: boolean;
  warning?: string;
}

export interface Place {
  id: string;
  name: string;
  localName?: string;
  category: Category;
  latitude: number;
  longitude: number;
  description: string;
  interest?: string;
  recommendedDuration?: number; // minutes
  priority: Priority;
  openingHours?: string;
  price?: string;
  weatherSensitive: boolean;
  tips?: string;
  favorite: boolean;
  userAdded: boolean;
  personalRating?: number; // 1-5
  notes?: string;
}

export interface Activity {
  id: string;
  dayId: string;
  placeId?: string;
  title: string;
  description?: string;
  category: Category;
  plannedStartTime?: string; // HH:mm
  plannedDuration?: number; // minutes
  actualStartTime?: string; // ISO
  actualEndTime?: string; // ISO
  status: ActivityStatus;
  priority: Priority;
  weatherSensitive: boolean;
  latitude?: number;
  longitude?: number;
  cost?: number;
  notes?: string;
  order: number;
  originalDayId?: string; // renseigné quand l'activité a été déplacée / rattrapée
}

export interface RouteLeg {
  id: string;
  dayId: string;
  from: string;
  to: string;
  mode: TransportMode;
  distanceKm?: number;
  plannedDuration?: number; // minutes
  recommendedDeparture?: string; // HH:mm
  actualStartTime?: string; // ISO
  actualEndTime?: string; // ISO
  status: 'planned' | 'in_progress' | 'paused' | 'completed';
  order: number;
  notes?: string;
}

export interface Accommodation {
  id: string;
  dayId: string;
  date: string;
  city: string;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  link?: string;
  checkIn?: string;
  checkOut?: string;
  bookingReference?: string;
  price?: number;
  paid: boolean;
  notes?: string;
}

export interface Transport {
  id: string;
  dayId?: string;
  date: string;
  origin: string;
  destination: string;
  mode: TransportMode;
  company?: string;
  number?: string;
  departureTime?: string; // HH:mm
  arrivalTime?: string; // HH:mm
  departureAirport?: string;
  terminal?: string;
  bookingReference?: string;
  price?: number;
  status: 'to_book' | 'booked' | 'done';
  critical: boolean; // vols → compte à rebours
  notes?: string;
  // Vol : calcul du départ recommandé depuis l'hôtel
  transferMinutes?: number;
  bufferMinutes?: number;
}

export interface Reservation {
  id: string;
  kind: 'flight' | 'hotel' | 'scooter' | 'guide' | 'activity' | 'other';
  title: string;
  date?: string;
  reference?: string;
  price?: number;
  paid: boolean;
  link?: string;
  contact?: string;
  notes?: string;
  refId?: string; // id du transport / hébergement lié
}

export interface Expense {
  id: string;
  amount: number; // THB
  category:
    | 'logement'
    | 'nourriture'
    | 'scooter'
    | 'essence'
    | 'avion'
    | 'transport'
    | 'temples'
    | 'activites'
    | 'shopping'
    | 'autre';
  date: string; // YYYY-MM-DD
  place?: string;
  comment?: string;
  liters?: number;
  createdAt: string;
}

export interface Note {
  id: string;
  text: string;
  category: 'general' | 'resto' | 'route' | 'photo' | 'conseil' | 'contact' | 'autre';
  date: string;
  place?: string;
  latitude?: number;
  longitude?: number;
  favorite: boolean;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  checked: boolean;
  order: number;
  userAdded: boolean;
}

export interface WeatherSnapshot {
  id: string; // = date YYYY-MM-DD
  date: string;
  source: 'auto' | 'manual';
  temperature?: number;
  condition?: string;
  rainProbability?: number; // 0-100
  heavyRain?: boolean;
  comment?: string;
  fetchedAt?: string;
  tomorrowRainProbability?: number;
  sunset?: string; // HH:mm
}

export interface ScooterRental {
  id: string;
  shopName?: string;
  contact?: string;
  model?: string;
  plate?: string;
  pricePerDay?: number;
  deposit?: number;
  pickupDate?: string;
  returnDate?: string;
  fuelLevel?: string;
  existingDamage?: string;
  notes?: string;
}

export interface HikeSession {
  id: string;
  activityId: string;
  startedAt: string;
  endedAt?: string;
}

export interface Photo {
  id: string;
  refType: 'place' | 'note' | 'expense' | 'scooter' | 'activity';
  refId: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  label: string;
  phone?: string;
  note?: string;
  order: number;
}

export interface AppSettings {
  id: string; // 'app'
  theme: 'light' | 'dark' | 'system';
  distanceUnit: 'km' | 'mi';
  weatherMode: 'auto' | 'manual';
  notificationsEnabled: boolean;
  gpsEnabled: boolean;
  includeSkippedInCatchUp: boolean;
  installPromptDismissedAt?: string;
  onboardingDone: boolean;
}

export interface MetaRow {
  key: string;
  value: string;
}

export interface BackupPayload {
  format: 'thai-road-trip-backup';
  version: number;
  exportedAt: string;
  data: {
    days: TripDay[];
    places: Place[];
    activities: Activity[];
    routeLegs: RouteLeg[];
    accommodations: Accommodation[];
    transports: Transport[];
    reservations: Reservation[];
    expenses: Expense[];
    notes: Note[];
    checklist: ChecklistItem[];
    weather: WeatherSnapshot[];
    scooter: ScooterRental[];
    hikes: HikeSession[];
    emergency: EmergencyContact[];
    settings: AppSettings[];
  };
}
