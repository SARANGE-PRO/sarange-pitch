import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowRight, Pencil, Plane } from 'lucide-react';
import { db } from '@/db';
import type { Transport } from '@/types';
import { frenchDateShort, subtractMinutes } from '@/utils/datetime';
import { formatTHB } from '@/utils/format';
import { Badge, BottomSheet, Button, Card, Field, TextInput } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/useToast';

const MODE_EMOJI: Record<Transport['mode'], string> = {
  plane: '✈️',
  scooter: '🛵',
  taxi: '🚕',
  bus: '🚌',
  train: '🚆',
  walk: '🚶',
  other: '🚐',
};

export default function TransportsPage() {
  const [editing, setEditing] = useState<Transport | null>(null);
  const transports = useLiveQuery(() => db.transports.orderBy('date').toArray(), []);

  return (
    <div className="space-y-4">
      <PageHeader back title="Transports" subtitle="Vols et trajets du voyage" />
      <div className="space-y-2">
        {(transports ?? []).map((t) => {
          const recommended =
            t.departureTime && t.transferMinutes !== undefined && t.bufferMinutes !== undefined
              ? subtractMinutes(t.departureTime, t.transferMinutes + t.bufferMinutes)
              : null;
          return (
            <Card key={t.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    <span className="text-lg">{MODE_EMOJI[t.mode]}</span>
                    {t.origin} <ArrowRight size={13} className="shrink-0 text-ink-3" /> {t.destination}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-3">
                    {frenchDateShort(t.date)}
                    {t.departureTime && ` · départ ${t.departureTime}`}
                    {t.arrivalTime && ` → ${t.arrivalTime}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {t.status === 'to_book' && <Badge tone="warn">À renseigner</Badge>}
                  {t.status === 'booked' && <Badge tone="ok">Réservé</Badge>}
                  {t.status === 'done' && <Badge>Effectué</Badge>}
                </div>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-ink-2">
                {t.company && <InfoCell label="Compagnie" value={t.company} />}
                {t.number && <InfoCell label="N°" value={t.number} />}
                {t.departureAirport && <InfoCell label="Aéroport" value={t.departureAirport} />}
                {t.terminal && <InfoCell label="Terminal" value={t.terminal} />}
                {t.bookingReference && <InfoCell label="Référence" value={t.bookingReference} />}
                {t.price !== undefined && <InfoCell label="Prix" value={formatTHB(t.price)} />}
              </dl>
              {recommended && (
                <p className="mt-2 rounded-xl bg-primary-soft p-2.5 text-xs font-bold text-primary">
                  🕐 Départ recommandé de l'hôtel : {recommended} ({t.transferMinutes} min de trajet +{' '}
                  {t.bufferMinutes} min de marge)
                </p>
              )}
              {t.mode === 'plane' && !t.departureTime && (
                <p className="mt-2 text-xs text-ink-3">Horaires non renseignés — toucher Modifier pour compléter.</p>
              )}
              {t.notes && <p className="mt-2 text-xs text-ink-3">{t.notes}</p>}
              <Button variant="secondary" full className="mt-3 !min-h-[40px] text-xs" onClick={() => setEditing(t)}>
                <Pencil size={14} /> Modifier
              </Button>
            </Card>
          );
        })}
      </div>
      <TransportEditSheet transport={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-ink-3">{label} : </span>
      {value}
    </div>
  );
}

/** Formulaire vol simple : airline, numéro, aéroport, terminal, horaire, référence + calcul du départ recommandé. */
function TransportEditSheet({ transport, onClose }: { transport: Transport | null; onClose: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState<Partial<Transport>>({});
  const t = transport;
  const value = (key: keyof Transport) => (form[key] ?? t?.[key] ?? '') as string;
  const isPlane = t?.mode === 'plane';

  if (!t) return null;

  return (
    <BottomSheet open onClose={onClose} title={`${t.origin} → ${t.destination}`}>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const patch: Partial<Transport> = {
            company: (value('company') as string) || undefined,
            number: (value('number') as string) || undefined,
            departureAirport: (value('departureAirport') as string) || undefined,
            terminal: (value('terminal') as string) || undefined,
            departureTime: (value('departureTime') as string) || undefined,
            arrivalTime: (value('arrivalTime') as string) || undefined,
            bookingReference: (value('bookingReference') as string) || undefined,
            price: form.price !== undefined ? Number(form.price) || undefined : t.price,
            transferMinutes:
              form.transferMinutes !== undefined ? Number(form.transferMinutes) || undefined : t.transferMinutes,
            bufferMinutes:
              form.bufferMinutes !== undefined ? Number(form.bufferMinutes) || undefined : t.bufferMinutes,
            notes: (value('notes') as string) || undefined,
          };
          patch.status = patch.departureTime ? 'booked' : t.status;
          await db.transports.update(t.id, patch);
          setForm({});
          onClose();
          toast('Transport mis à jour');
        }}
      >
        {isPlane && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Compagnie">
              <TextInput value={value('company')} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Ex : Bangkok Airways" />
            </Field>
            <Field label="N° de vol">
              <TextInput value={value('number')} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="Ex : PG241" />
            </Field>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heure de départ">
            <TextInput type="time" value={value('departureTime')} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />
          </Field>
          <Field label="Heure d'arrivée">
            <TextInput type="time" value={value('arrivalTime')} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />
          </Field>
        </div>
        {isPlane && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Aéroport de départ">
                <TextInput
                  value={value('departureAirport')}
                  onChange={(e) => setForm({ ...form, departureAirport: e.target.value })}
                  placeholder="Ex : BKK / DMK / CNX"
                />
              </Field>
              <Field label="Terminal">
                <TextInput value={value('terminal')} onChange={(e) => setForm({ ...form, terminal: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Trajet vers l'aéroport (min)">
                <TextInput
                  type="number"
                  inputMode="numeric"
                  value={String(form.transferMinutes ?? t.transferMinutes ?? '')}
                  onChange={(e) => setForm({ ...form, transferMinutes: Number(e.target.value) })}
                  placeholder="60"
                />
              </Field>
              <Field label="Marge souhaitée (min)">
                <TextInput
                  type="number"
                  inputMode="numeric"
                  value={String(form.bufferMinutes ?? t.bufferMinutes ?? '')}
                  onChange={(e) => setForm({ ...form, bufferMinutes: Number(e.target.value) })}
                  placeholder="180"
                />
              </Field>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Référence">
            <TextInput value={value('bookingReference')} onChange={(e) => setForm({ ...form, bookingReference: e.target.value })} />
          </Field>
          <Field label="Prix (฿)">
            <TextInput
              type="number"
              inputMode="decimal"
              value={String(form.price ?? t.price ?? '')}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </Field>
        </div>
        <Field label="Notes">
          <TextInput value={value('notes')} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
        {isPlane && (
          <p className="flex items-center gap-2 text-xs text-ink-3">
            <Plane size={13} /> L'heure recommandée de départ de l'hôtel est calculée automatiquement à partir de
            l'horaire, du trajet et de la marge.
          </p>
        )}
        <Button full type="submit">
          Enregistrer
        </Button>
      </form>
    </BottomSheet>
  );
}
