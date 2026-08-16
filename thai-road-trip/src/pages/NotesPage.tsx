import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Heart, Plus, Search, StickyNote, Trash2 } from 'lucide-react';
import { db } from '@/db';
import type { Note } from '@/types';
import { bangkokToday, frenchDateShort } from '@/utils/datetime';
import {
  Badge, BottomSheet, Button, Card, ConfirmDialog, EmptyState, Field, IconButton, Select, TextArea, TextInput,
  useDisclosure,
} from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/useToast';
import { uid } from '@/utils/id';

const NOTE_CATEGORIES: { value: Note['category']; label: string }[] = [
  { value: 'general', label: 'Général' },
  { value: 'resto', label: 'Resto / café' },
  { value: 'route', label: 'Route' },
  { value: 'photo', label: 'Spot photo' },
  { value: 'conseil', label: 'Conseil' },
  { value: 'contact', label: 'Contact' },
  { value: 'autre', label: 'Autre' },
];

export default function NotesPage() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const addSheet = useDisclosure();
  const [toDelete, setToDelete] = useState<Note | null>(null);
  const notes = useLiveQuery(() => db.notes.toArray(), []);

  const filtered = useMemo(() => {
    if (!notes) return [];
    const q = query.trim().toLowerCase();
    return notes
      .filter(
        (n) =>
          !q ||
          n.text.toLowerCase().includes(q) ||
          (n.place ?? '').toLowerCase().includes(q) ||
          NOTE_CATEGORIES.find((c) => c.value === n.category)?.label.toLowerCase().includes(q),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [notes, query]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notes"
        action={
          <Button onClick={addSheet.onOpen} className="!min-h-[40px] !px-3 text-xs">
            <Plus size={15} /> Ajouter
          </Button>
        }
      />

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher dans les notes…"
          className="!pl-10"
          aria-label="Rechercher dans les notes"
        />
      </div>

      {notes && notes.length === 0 ? (
        <EmptyState
          icon={<StickyNote size={26} />}
          title="Aucune note pour le moment"
          subtitle="Restaurant sympa, route dangereuse, spot photo, prix de l'essence… tout se note ici."
          action={
            <Button onClick={addSheet.onOpen}>
              <Plus size={16} /> Ajouter une note
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((note) => (
            <Card key={note.id} className="!p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="primary">{NOTE_CATEGORIES.find((c) => c.value === note.category)?.label}</Badge>
                  <span className="text-xs text-ink-3">{frenchDateShort(note.date)}</span>
                  {note.place && <span className="text-xs text-ink-3">· {note.place}</span>}
                </div>
                <div className="flex shrink-0">
                  <IconButton
                    label="Favori"
                    className="h-8 w-8"
                    onClick={() => db.notes.update(note.id, { favorite: !note.favorite })}
                  >
                    <Heart size={15} className={note.favorite ? 'fill-danger text-danger' : ''} />
                  </IconButton>
                  <IconButton label="Supprimer" className="h-8 w-8" onClick={() => setToDelete(note)}>
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink">{note.text}</p>
            </Card>
          ))}
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-ink-3">Aucune note ne correspond.</p>}
        </div>
      )}

      <AddNoteSheet open={addSheet.open} onClose={addSheet.onClose} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer la note ?"
        message="Cette note sera définitivement supprimée."
        confirmLabel="Supprimer"
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await db.notes.delete(toDelete.id);
          setToDelete(null);
          toast('Note supprimée');
        }}
      />
    </div>
  );
}

function AddNoteSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Note['category']>('general');
  const [place, setPlace] = useState('');

  return (
    <BottomSheet open={open} onClose={onClose} title="Ajouter une note">
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!text.trim()) return;
          await db.notes.put({
            id: uid('note'),
            text: text.trim(),
            category,
            date: bangkokToday(),
            place: place || undefined,
            favorite: false,
            createdAt: new Date().toISOString(),
          });
          setText('');
          setPlace('');
          onClose();
          toast('Note enregistrée');
        }}
      >
        <Field label="Note">
          <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Ex : Super khao soi à 60 ฿ près de Tha Phae" required />
        </Field>
        <Field label="Catégorie">
          <Select value={category} onChange={(e) => setCategory(e.target.value as Note['category'])}>
            {NOTE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Lieu (optionnel)">
          <TextInput value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ex : Chiang Mai" />
        </Field>
        <Button full type="submit">
          Enregistrer
        </Button>
      </form>
    </BottomSheet>
  );
}
