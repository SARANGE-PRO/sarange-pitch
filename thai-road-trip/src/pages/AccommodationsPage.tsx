import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BedDouble, Compass, Pencil, Phone } from 'lucide-react';
import { db } from '@/db';
import type { Accommodation } from '@/types';
import { frenchDate } from '@/utils/datetime';
import { formatTHB } from '@/utils/format';
import { Badge, BottomSheet, Button, Card, Field, Select, TextInput } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { openNavigation } from '@/services/navigation';
import { useToast } from '@/hooks/useToast';

export default function AccommodationsPage() {
  const [editing, setEditing] = useState<Accommodation | null>(null);
  const accommodations = useLiveQuery(() => db.accommodations.orderBy('date').toArray(), []);

  return (
    <div className="space-y-4">
      <PageHeader back title="Hébergements" subtitle="Une nuit par ligne — tout est modifiable" />
      <div className="space-y-2">
        {(accommodations ?? []).map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-3">{frenchDate(a.date)}</p>
                <p className="mt-0.5 flex items-center gap-2 text-base font-extrabold">
                  <BedDouble size={16} className="text-primary" /> {a.city}
                </p>
                <p className="text-sm text-ink-2">{a.name ?? 'À renseigner'}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {a.name ? (
                  a.paid ? (
                    <Badge tone="ok">Payé</Badge>
                  ) : (
                    <Badge tone="warn">Non payé</Badge>
                  )
                ) : (
                  <Badge tone="warn">À renseigner</Badge>
                )}
                {a.price !== undefined && <span className="text-sm font-bold">{formatTHB(a.price)}</span>}
              </div>
            </div>
            <dl className="mt-2 space-y-1 text-xs text-ink-2">
              {a.address && <div>📍 {a.address}</div>}
              {(a.checkIn || a.checkOut) && (
                <div>
                  🕐 {a.checkIn && `Check-in ${a.checkIn}`}
                  {a.checkIn && a.checkOut && ' · '}
                  {a.checkOut && `Check-out ${a.checkOut}`}
                </div>
              )}
              {a.bookingReference && <div>🔖 Réf. {a.bookingReference}</div>}
              {a.notes && <div className="text-ink-3">{a.notes}</div>}
            </dl>
            <div className="mt-3 flex gap-2">
              {a.phone && (
                <a href={`tel:${a.phone}`} className="flex-1">
                  <Button variant="secondary" full className="!min-h-[40px] text-xs">
                    <Phone size={14} /> Appeler
                  </Button>
                </a>
              )}
              {a.latitude !== undefined && a.longitude !== undefined && (
                <Button
                  variant="secondary"
                  className="flex-1 !min-h-[40px] text-xs"
                  onClick={() => openNavigation(a.latitude as number, a.longitude as number)}
                >
                  <Compass size={14} /> Naviguer
                </Button>
              )}
              <Button variant="secondary" className="flex-1 !min-h-[40px] text-xs" onClick={() => setEditing(a)}>
                <Pencil size={14} /> Modifier
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <AccommodationEditSheet accommodation={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function AccommodationEditSheet({
  accommodation,
  onClose,
}: {
  accommodation: Accommodation | null;
  onClose: () => void;
}) {
  const toast = useToast();
  const [form, setForm] = useState<Record<string, string>>({});
  const a = accommodation;
  if (!a) return null;
  const value = (key: keyof Accommodation) => form[key] ?? String(a[key] ?? '');

  return (
    <BottomSheet open onClose={onClose} title={`Nuit à ${a.city}`}>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await db.accommodations.update(a.id, {
            name: value('name') || undefined,
            address: value('address') || undefined,
            phone: value('phone') || undefined,
            link: value('link') || undefined,
            checkIn: value('checkIn') || undefined,
            checkOut: value('checkOut') || undefined,
            bookingReference: value('bookingReference') || undefined,
            price: value('price') ? Number(value('price')) : undefined,
            paid: form.paid !== undefined ? form.paid === 'oui' : a.paid,
            latitude: value('latitude') ? Number(value('latitude')) : undefined,
            longitude: value('longitude') ? Number(value('longitude')) : undefined,
            notes: value('notes') || undefined,
          });
          setForm({});
          onClose();
          toast('Hébergement mis à jour');
        }}
      >
        <Field label="Nom de l'hébergement">
          <TextInput value={value('name')} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex : homestay, hôtel…" />
        </Field>
        <Field label="Adresse">
          <TextInput value={value('address')} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude">
            <TextInput inputMode="decimal" value={value('latitude')} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          </Field>
          <Field label="Longitude">
            <TextInput inputMode="decimal" value={value('longitude')} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Téléphone">
            <TextInput type="tel" value={value('phone')} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Lien (réservation)">
            <TextInput type="url" value={value('link')} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Check-in">
            <TextInput type="time" value={value('checkIn')} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
          </Field>
          <Field label="Check-out">
            <TextInput type="time" value={value('checkOut')} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Référence">
            <TextInput value={value('bookingReference')} onChange={(e) => setForm({ ...form, bookingReference: e.target.value })} />
          </Field>
          <Field label="Prix (฿)">
            <TextInput type="number" inputMode="decimal" value={value('price')} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Field>
          <Field label="Payé">
            <Select value={form.paid ?? (a.paid ? 'oui' : 'non')} onChange={(e) => setForm({ ...form, paid: e.target.value })}>
              <option value="non">Non</option>
              <option value="oui">Oui</option>
            </Select>
          </Field>
        </div>
        <Field label="Notes">
          <TextInput value={value('notes')} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
        <Button full type="submit">
          Enregistrer
        </Button>
      </form>
    </BottomSheet>
  );
}
