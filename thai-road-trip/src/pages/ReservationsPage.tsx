import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Ticket, Trash2 } from 'lucide-react';
import { db } from '@/db';
import type { Reservation } from '@/types';
import { formatTHB } from '@/utils/format';
import {
  Badge, BottomSheet, Button, Card, EmptyState, Field, IconButton, Select, TextInput, useDisclosure,
} from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/useToast';
import { uid } from '@/utils/id';

const KIND_LABELS: Record<Reservation['kind'], string> = {
  flight: 'Vol',
  hotel: 'Hôtel',
  scooter: 'Location scooter',
  guide: 'Guide',
  activity: 'Activité',
  other: 'Autre',
};

/** Vue regroupée des réservations. Vols et hôtels détaillés vivent dans leurs sections. */
export default function ReservationsPage() {
  const toast = useToast();
  const addSheet = useDisclosure();
  const [editing, setEditing] = useState<Reservation | null>(null);
  const reservations = useLiveQuery(() => db.reservations.toArray(), []);
  const flightsToBook = useLiveQuery(
    () => db.transports.filter((t) => t.mode === 'plane').toArray(),
    [],
  );
  const hotels = useLiveQuery(() => db.accommodations.toArray(), []);

  return (
    <div className="space-y-4">
      <PageHeader
        back
        title="Réservations"
        action={
          <Button onClick={addSheet.onOpen} className="!min-h-[40px] !px-3 text-xs">
            <Plus size={15} /> Ajouter
          </Button>
        }
      />

      <Link to="/transports">
        <Card className="flex items-center gap-3">
          <span className="text-xl">✈️</span>
          <div className="flex-1">
            <p className="text-sm font-bold">Vols</p>
            <p className="text-xs text-ink-3">
              {flightsToBook
                ? `${flightsToBook.filter((f) => f.status !== 'to_book').length} / ${flightsToBook.length} renseignés`
                : '…'}
            </p>
          </div>
          <ArrowRight size={16} className="text-ink-3" />
        </Card>
      </Link>
      <Link to="/hebergements">
        <Card className="flex items-center gap-3">
          <span className="text-xl">🛏</span>
          <div className="flex-1">
            <p className="text-sm font-bold">Hôtels & homestays</p>
            <p className="text-xs text-ink-3">
              {hotels ? `${hotels.filter((h) => h.name).length} / ${hotels.length} renseignés` : '…'}
            </p>
          </div>
          <ArrowRight size={16} className="text-ink-3" />
        </Card>
      </Link>
      <Link to="/scooter">
        <Card className="flex items-center gap-3">
          <span className="text-xl">🛵</span>
          <div className="flex-1">
            <p className="text-sm font-bold">Location scooter</p>
            <p className="text-xs text-ink-3">Fiche loueur, photos, caution</p>
          </div>
          <ArrowRight size={16} className="text-ink-3" />
        </Card>
      </Link>

      <section>
        <h2 className="mb-2 text-base font-extrabold">Autres réservations</h2>
        {reservations && reservations.length === 0 ? (
          <EmptyState
            icon={<Ticket size={26} />}
            title="Aucune autre réservation"
            subtitle="Guides, activités réservées, billets…"
            action={
              <Button onClick={addSheet.onOpen}>
                <Plus size={16} /> Ajouter une réservation
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {(reservations ?? []).map((r) => (
              <Card key={r.id} className="!p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{r.title}</p>
                    <p className="mt-0.5 text-xs text-ink-3">
                      {KIND_LABELS[r.kind]}
                      {r.date && ` · ${r.date}`}
                      {r.reference && ` · réf. ${r.reference}`}
                      {r.contact && ` · ${r.contact}`}
                    </p>
                    {r.notes && <p className="mt-1 text-xs text-ink-3">{r.notes}</p>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {r.paid ? <Badge tone="ok">Payé</Badge> : <Badge tone="warn">Non payé</Badge>}
                    {r.price !== undefined && <span className="text-sm font-bold">{formatTHB(r.price)}</span>}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button variant="secondary" className="flex-1 !min-h-[38px] text-xs" onClick={() => setEditing(r)}>
                    Modifier
                  </Button>
                  <IconButton
                    label="Supprimer"
                    className="h-9 w-9"
                    onClick={async () => {
                      await db.reservations.delete(r.id);
                      toast('Réservation supprimée');
                    }}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <ReservationSheet
        reservation={editing}
        open={addSheet.open || Boolean(editing)}
        onClose={() => {
          addSheet.onClose();
          setEditing(null);
        }}
      />
    </div>
  );
}

function ReservationSheet({
  reservation,
  open,
  onClose,
}: {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const [form, setForm] = useState<Record<string, string>>({});
  const value = (key: keyof Reservation, fallback = '') => form[key] ?? String(reservation?.[key] ?? fallback);

  if (!open) return null;

  return (
    <BottomSheet open onClose={onClose} title={reservation ? 'Modifier la réservation' : 'Nouvelle réservation'}>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const title = value('title').trim();
          if (!title) return;
          const payload: Reservation = {
            id: reservation?.id ?? uid('resa'),
            kind: (value('kind', 'activity') as Reservation['kind']) || 'activity',
            title,
            date: value('date') || undefined,
            reference: value('reference') || undefined,
            price: value('price') ? Number(value('price')) : undefined,
            paid: value('paid', reservation?.paid ? 'oui' : 'non') === 'oui',
            link: value('link') || undefined,
            contact: value('contact') || undefined,
            notes: value('notes') || undefined,
          };
          await db.reservations.put(payload);
          setForm({});
          onClose();
          toast(reservation ? 'Réservation modifiée' : 'Réservation ajoutée');
        }}
      >
        <Field label="Titre">
          <TextInput value={value('title')} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex : guide Pha Dok Siew" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <Select value={value('kind', 'activity')} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              {Object.entries(KIND_LABELS).map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date">
            <TextInput type="date" value={value('date')} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Référence">
            <TextInput value={value('reference')} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </Field>
          <Field label="Prix (฿)">
            <TextInput type="number" inputMode="decimal" value={value('price')} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </Field>
          <Field label="Payé">
            <Select value={value('paid', reservation?.paid ? 'oui' : 'non')} onChange={(e) => setForm({ ...form, paid: e.target.value })}>
              <option value="non">Non</option>
              <option value="oui">Oui</option>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Lien / document">
            <TextInput type="url" value={value('link')} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          </Field>
          <Field label="Contact">
            <TextInput value={value('contact')} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </Field>
        </div>
        <Field label="Note">
          <TextInput value={value('notes')} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
        <Button full type="submit">
          Enregistrer
        </Button>
      </form>
    </BottomSheet>
  );
}
