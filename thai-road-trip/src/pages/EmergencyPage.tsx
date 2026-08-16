import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Pencil, Phone, ShieldAlert } from 'lucide-react';
import { db } from '@/db';
import type { EmergencyContact } from '@/types';
import { BottomSheet, Button, Card, Field, TextInput, Badge } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/useToast';

/**
 * Page urgence : uniquement des champs éditables — aucun numéro n'est
 * pré-rempli ni inventé. "Non renseigné" tant que vide.
 */
export default function EmergencyPage() {
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const contacts = useLiveQuery(() => db.emergency.orderBy('order').toArray(), []);

  return (
    <div className="space-y-4">
      <PageHeader back title="Urgence" subtitle="Renseignez vos numéros avant le départ" />
      <Card className="flex items-start gap-3 border-l-4 border-danger">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-danger" />
        <p className="text-xs text-ink-2">
          Aucun numéro n'est pré-rempli : vérifiez et saisissez vous-même les numéros officiels (assurance, ambassade,
          hôpital…) avant le départ pour les avoir hors connexion.
        </p>
      </Card>
      <div className="space-y-2">
        {(contacts ?? []).map((c) => (
          <Card key={c.id} className="flex items-center gap-3 !p-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{c.label}</p>
              {c.phone ? (
                <p className="text-sm text-ink-2">{c.phone}</p>
              ) : (
                <Badge tone="neutral">Non renseigné</Badge>
              )}
              {c.note && <p className="mt-0.5 text-xs text-ink-3">{c.note}</p>}
            </div>
            {c.phone && (
              <a href={`tel:${c.phone}`}>
                <Button className="!min-h-[40px] !px-3 text-xs">
                  <Phone size={14} /> Appeler
                </Button>
              </a>
            )}
            <Button variant="secondary" className="!min-h-[40px] !px-3 text-xs" onClick={() => setEditing(c)}>
              <Pencil size={14} />
            </Button>
          </Card>
        ))}
      </div>
      <EmergencyEditSheet contact={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function EmergencyEditSheet({ contact, onClose }: { contact: EmergencyContact | null; onClose: () => void }) {
  const toast = useToast();
  const [phone, setPhone] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  if (!contact) return null;

  return (
    <BottomSheet open onClose={onClose} title={contact.label}>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await db.emergency.update(contact.id, {
            phone: (phone ?? contact.phone ?? '').trim() || undefined,
            note: (note ?? contact.note ?? '').trim() || undefined,
          });
          setPhone(null);
          setNote(null);
          onClose();
          toast('Contact mis à jour');
        }}
      >
        <Field label="Numéro de téléphone">
          <TextInput
            type="tel"
            value={phone ?? contact.phone ?? ''}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+66 …"
          />
        </Field>
        <Field label="Note">
          <TextInput value={note ?? contact.note ?? ''} onChange={(e) => setNote(e.target.value)} placeholder="Ex : n° de contrat" />
        </Field>
        <Button full type="submit">
          Enregistrer
        </Button>
      </form>
    </BottomSheet>
  );
}
