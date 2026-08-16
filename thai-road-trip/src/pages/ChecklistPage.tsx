import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';
import { db } from '@/db';
import {
  BottomSheet, Button, Card, EmptyState, Field, IconButton, ProgressBar, TextInput, useDisclosure,
} from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/useToast';
import { uid } from '@/utils/id';

export default function ChecklistPage() {
  const toast = useToast();
  const addSheet = useDisclosure();
  const items = useLiveQuery(() => db.checklist.orderBy('order').toArray(), []);

  const grouped = useMemo(() => {
    const map = new Map<string, NonNullable<typeof items>>();
    for (const item of items ?? []) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [items]);

  const done = (items ?? []).filter((i) => i.checked).length;
  const total = items?.length ?? 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Checklist"
        action={
          <Button onClick={addSheet.onOpen} className="!min-h-[40px] !px-3 text-xs">
            <Plus size={15} /> Ajouter
          </Button>
        }
      />

      {total > 0 && (
        <Card>
          <ProgressBar value={total ? Math.round((done / total) * 100) : 0} />
          <p className="mt-1.5 text-xs text-ink-3">
            {done} / {total} éléments cochés
          </p>
        </Card>
      )}

      {items && items.length === 0 && (
        <EmptyState
          icon={<ClipboardList size={26} />}
          title="Checklist vide"
          subtitle="Ajoutez vos propres éléments à vérifier."
          action={
            <Button onClick={addSheet.onOpen}>
              <Plus size={16} /> Ajouter un élément
            </Button>
          }
        />
      )}

      {[...grouped.entries()].map(([category, list]) => (
        <section key={category}>
          <h2 className="mb-2 text-base font-extrabold">{category}</h2>
          <Card className="divide-y divide-line !p-0">
            {list.map((item) => (
              <div key={item.id} className="flex min-h-[48px] items-center gap-3 px-4 py-1.5">
                <input
                  id={`check-${item.id}`}
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => db.checklist.update(item.id, { checked: !item.checked })}
                  className="h-5 w-5 shrink-0 accent-[rgb(var(--c-primary))]"
                />
                <label
                  htmlFor={`check-${item.id}`}
                  className={`flex-1 cursor-pointer py-2 text-sm font-medium ${item.checked ? 'text-ink-3 line-through' : ''}`}
                >
                  {item.label}
                </label>
                <IconButton
                  label="Supprimer"
                  className="h-9 w-9 shrink-0"
                  onClick={async () => {
                    await db.checklist.delete(item.id);
                    toast('Élément supprimé');
                  }}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
            ))}
          </Card>
        </section>
      ))}

      <AddChecklistSheet open={addSheet.open} onClose={addSheet.onClose} existingCategories={[...grouped.keys()]} />
    </div>
  );
}

function AddChecklistSheet({
  open,
  onClose,
  existingCategories,
}: {
  open: boolean;
  onClose: () => void;
  existingCategories: string[];
}) {
  const toast = useToast();
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('');

  return (
    <BottomSheet open={open} onClose={onClose} title="Ajouter à la checklist">
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!label.trim()) return;
          const items = await db.checklist.toArray();
          await db.checklist.put({
            id: uid('check'),
            label: label.trim(),
            category: category.trim() || 'Divers',
            checked: false,
            order: Math.max(0, ...items.map((i) => i.order)) + 1,
            userAdded: true,
          });
          setLabel('');
          onClose();
          toast('Ajouté à la checklist');
        }}
      >
        <Field label="Élément">
          <TextInput value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex : lampe frontale" required />
        </Field>
        <Field label="Catégorie" hint={existingCategories.length ? `Existantes : ${existingCategories.join(', ')}` : undefined}>
          <TextInput value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex : Randonnée" list="checklist-cats" />
          <datalist id="checklist-cats">
            {existingCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Button full type="submit">
          Ajouter
        </Button>
      </form>
    </BottomSheet>
  );
}
