import { useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { Compass, Heart, Plus, Star } from 'lucide-react';
import { db } from '@/db';
import type { Category, Place } from '@/types';
import { bangkokToday } from '@/utils/datetime';
import { CATEGORY_META } from '@/components/ui/CategoryIcon';
import { Badge, BottomSheet, Button, Field, Select, TextInput, useDisclosure } from '@/components/ui';
import { openNavigation } from '@/services/navigation';
import { useGeoPosition } from '@/hooks/useGeoPosition';
import { useOnline } from '@/hooks/useOnline';
import { useToast } from '@/hooks/useToast';
import { uid } from '@/utils/id';

type Filter =
  | 'today'
  | 'all'
  | 'temple'
  | 'hike'
  | 'waterfall'
  | 'food'
  | 'hotel'
  | 'transport'
  | 'favorites';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'all', label: 'Tout' },
  { key: 'temple', label: 'Temples' },
  { key: 'hike', label: 'Randos' },
  { key: 'waterfall', label: 'Cascades' },
  { key: 'food', label: 'Food' },
  { key: 'hotel', label: 'Hébergements' },
  { key: 'transport', label: 'Transport' },
  { key: 'favorites', label: 'Favoris' },
];

/** Ordre du road-trip pour tracer l'itinéraire sur la carte. */
const ROUTE_ORDER = [
  'chiang-mai-old-city',
  'wat-umong',
  'wat-pha-lat',
  'doi-suthep',
  'mae-kampong',
  'doi-inthanon-park',
  'wachirathan-waterfall',
  'royal-twin-pagodas',
  'doi-inthanon-summit',
  'mae-klang-luang',
  'chiang-mai-airport',
];

export default function MapPage() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Place | null>(null);
  const online = useOnline();
  const { position } = useGeoPosition(true);
  const addSheet = useDisclosure();

  const places = useLiveQuery(() => db.places.toArray(), []);
  const todayPlaceIds = useLiveQuery(async () => {
    const today = bangkokToday();
    const day = await db.days.where('date').equals(today).first();
    if (!day) return new Set<string>();
    const activities = await db.activities.where('dayId').equals(day.id).toArray();
    return new Set(activities.map((a) => a.placeId).filter(Boolean) as string[]);
  }, []);

  const filtered = useMemo(() => {
    if (!places) return [];
    switch (filter) {
      case 'all':
        return places;
      case 'today':
        return places.filter((p) => todayPlaceIds?.has(p.id));
      case 'favorites':
        return places.filter((p) => p.favorite);
      case 'food':
        return places.filter((p) => p.category === 'food' || p.category === 'cafe' || p.category === 'market');
      case 'transport':
        return places.filter((p) => p.category === 'airport' || p.category === 'transport' || p.category === 'scooter');
      default:
        return places.filter((p) => p.category === filter);
    }
  }, [places, filter, todayPlaceIds]);

  // Initialisation de la carte
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: true }).setView(
      [18.72, 98.95],
      9,
    );
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Markers + itinéraire
  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group || !places) return;
    group.clearLayers();

    if (filter === 'all' || filter === 'today') {
      const routePoints = ROUTE_ORDER.map((id) => places.find((p) => p.id === id))
        .filter((p): p is Place => Boolean(p))
        .map((p) => [p.latitude, p.longitude] as [number, number]);
      L.polyline(routePoints, { color: '#0f766e', weight: 3, opacity: 0.55, dashArray: '6 8' }).addTo(group);
    }

    for (const place of filtered) {
      const meta = CATEGORY_META[place.category] ?? CATEGORY_META.other;
      const icon = L.divIcon({
        className: '',
        html: `<div class="marker-pin" style="background:${meta.color}"><span>${meta.emoji}</span></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 30],
      });
      L.marker([place.latitude, place.longitude], { icon, title: place.name })
        .on('click', () => setSelected(place))
        .addTo(group);
    }

    if (position) {
      L.circleMarker([position.latitude, position.longitude], {
        radius: 8,
        color: '#fff',
        weight: 2,
        fillColor: '#2563eb',
        fillOpacity: 1,
      })
        .bindTooltip('Vous êtes ici')
        .addTo(group);
    }

    if (filtered.length > 0 && filter !== 'all') {
      map.fitBounds(L.latLngBounds(filtered.map((p) => [p.latitude, p.longitude])), {
        padding: [40, 40],
        maxZoom: 14,
      });
    }
  }, [filtered, places, position, filter]);

  return (
    <div className="relative flex h-[calc(100dvh-0px)] flex-col">
      <div ref={containerRef} className="absolute inset-0 z-0" aria-label="Carte du road-trip" />

      {!online && (
        <div
          className="absolute inset-x-4 z-20 rounded-xl bg-surface/95 p-3 text-center shadow-card"
          style={{ top: 'calc(env(safe-area-inset-top) + 3.5rem)' }}
        >
          <p className="text-xs font-semibold text-ink-2">
            Hors connexion : le fond de carte peut être incomplet, mais tous les lieux, coordonnées et itinéraires
            restent disponibles ci-dessous.
          </p>
        </div>
      )}

      {/* Filtres */}
      <div className="pt-safe absolute inset-x-0 top-0 z-10">
        <div className="mt-2 flex gap-2 overflow-x-auto px-4 pb-2" role="tablist" aria-label="Filtres de la carte">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold shadow-card transition-colors ${
                filter === f.key ? 'bg-primary text-primary-ink' : 'bg-surface text-ink-2'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ajout rapide d'un lieu */}
      <button
        onClick={addSheet.onOpen}
        aria-label="Ajouter un lieu"
        className="absolute right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-sheet dark:text-[#1d1607]"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 6.5rem)' }}
      >
        <Plus size={22} />
      </button>

      <PlaceSheet place={selected} onClose={() => setSelected(null)} />
      <QuickAddPlaceSheet
        open={addSheet.open}
        onClose={addSheet.onClose}
        defaultCoords={position ? { lat: position.latitude, lon: position.longitude } : undefined}
      />
    </div>
  );
}

/** Bottom-sheet mobile d'un lieu depuis la carte. */
function PlaceSheet({ place, onClose }: { place: Place | null; onClose: () => void }) {
  const toast = useToast();
  if (!place) return null;
  const meta = CATEGORY_META[place.category] ?? CATEGORY_META.other;
  return (
    <BottomSheet open onClose={onClose} title={place.name}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">
            {meta.emoji} {meta.label}
          </Badge>
          {place.localName && <span className="text-sm text-ink-3">{place.localName}</span>}
          {place.weatherSensitive && <Badge tone="warn">🌧 météo-sensible</Badge>}
        </div>
        <p className="text-sm leading-relaxed text-ink-2">{place.description}</p>
        <p className="text-xs text-ink-3">
          GPS : {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => openNavigation(place.latitude, place.longitude)}>
            <Compass size={16} /> Naviguer
          </Button>
          <Link to={`/lieu/${place.id}`} onClick={onClose}>
            <Button variant="secondary" full>
              Fiche complète
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="col-span-2"
            onClick={async () => {
              await db.places.update(place.id, { favorite: !place.favorite });
              toast(place.favorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
              onClose();
            }}
          >
            <Heart size={16} className={place.favorite ? 'fill-danger text-danger' : ''} />
            {place.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

/** Ajout rapide d'un lieu (food, café…) depuis la carte ou la position GPS. */
export function QuickAddPlaceSheet({
  open,
  onClose,
  defaultCoords,
}: {
  open: boolean;
  onClose: () => void;
  defaultCoords?: { lat: number; lon: number };
}) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (open && defaultCoords) {
      setLat(defaultCoords.lat.toFixed(5));
      setLon(defaultCoords.lon.toFixed(5));
    }
  }, [open, defaultCoords]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Ajouter un lieu">
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const latNum = Number(lat);
          const lonNum = Number(lon);
          if (!name.trim() || Number.isNaN(latNum) || Number.isNaN(lonNum)) return;
          await db.places.put({
            id: uid('place'),
            name: name.trim(),
            category,
            latitude: latNum,
            longitude: lonNum,
            description: '',
            priority: 'normal',
            price: price || undefined,
            weatherSensitive: false,
            favorite: false,
            userAdded: true,
            personalRating: rating || undefined,
          });
          setName('');
          setPrice('');
          setRating(0);
          onClose();
          toast('Lieu ajouté');
        }}
      >
        <Field label="Nom">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Khao Soi Mae Sai" required />
        </Field>
        <Field label="Catégorie">
          <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {Object.entries(CATEGORY_META).map(([key, m]) => (
              <option key={key} value={key}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" hint={defaultCoords ? 'Pré-remplie depuis votre position' : undefined}>
            <TextInput value={lat} onChange={(e) => setLat(e.target.value)} inputMode="decimal" required />
          </Field>
          <Field label="Longitude">
            <TextInput value={lon} onChange={(e) => setLon(e.target.value)} inputMode="decimal" required />
          </Field>
        </div>
        <Field label="Prix (indicatif)">
          <TextInput value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex : 60 ฿ le bol" />
        </Field>
        <Field label="Note personnelle">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} étoiles`} className="p-1">
                <Star size={22} className={n <= rating ? 'fill-accent text-accent' : 'text-line'} />
              </button>
            ))}
          </div>
        </Field>
        <Button full type="submit">
          Ajouter
        </Button>
      </form>
    </BottomSheet>
  );
}
