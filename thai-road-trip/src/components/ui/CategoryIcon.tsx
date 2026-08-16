import {
  Landmark,
  Mountain,
  Droplets,
  Home,
  Eye,
  UtensilsCrossed,
  Coffee,
  BedDouble,
  Plane,
  Bus,
  Bike,
  Trees,
  ShoppingBag,
  Hand,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '@/types';

export const CATEGORY_META: Record<Category, { icon: LucideIcon; label: string; color: string; emoji: string }> = {
  temple: { icon: Landmark, label: 'Temple', color: '#ca8a04', emoji: '🛕' },
  hike: { icon: Mountain, label: 'Rando', color: '#16803f', emoji: '🥾' },
  waterfall: { icon: Droplets, label: 'Cascade', color: '#0e7490', emoji: '💧' },
  village: { icon: Home, label: 'Village', color: '#9a5b34', emoji: '🏘' },
  viewpoint: { icon: Eye, label: 'Point de vue', color: '#7c3aed', emoji: '🌄' },
  food: { icon: UtensilsCrossed, label: 'Food', color: '#dc2626', emoji: '🍜' },
  cafe: { icon: Coffee, label: 'Café', color: '#92400e', emoji: '☕' },
  hotel: { icon: BedDouble, label: 'Hébergement', color: '#4338ca', emoji: '🛏' },
  airport: { icon: Plane, label: 'Aéroport', color: '#475569', emoji: '✈️' },
  transport: { icon: Bus, label: 'Transport', color: '#475569', emoji: '🚌' },
  scooter: { icon: Bike, label: 'Scooter', color: '#0f766e', emoji: '🛵' },
  nature: { icon: Trees, label: 'Nature', color: '#15803d', emoji: '🌿' },
  market: { icon: ShoppingBag, label: 'Marché', color: '#be185d', emoji: '🛍' },
  massage: { icon: Hand, label: 'Massage', color: '#c026d3', emoji: '💆' },
  other: { icon: MapPin, label: 'Autre', color: '#64748b', emoji: '📍' },
};

export function CategoryIcon({
  category,
  size = 18,
  className = '',
}: {
  category: Category;
  size?: number;
  className?: string;
}) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.other;
  const Icon = meta.icon;
  return <Icon size={size} className={className} style={{ color: meta.color }} aria-hidden />;
}

export function CategoryChip({ category }: { category: Category }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.other;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-2">
      <CategoryIcon category={category} size={13} />
      {meta.label}
    </span>
  );
}
