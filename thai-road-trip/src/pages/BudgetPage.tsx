import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Fuel, Plus, Trash2, Wallet } from 'lucide-react';
import { db } from '@/db';
import type { Expense } from '@/types';
import { bangkokToday, frenchDateShort } from '@/utils/datetime';
import { formatTHB } from '@/utils/format';
import { EXPENSE_CATEGORY_LABELS, computeExpenseStats } from '@/services/expenses';
import {
  BottomSheet, Button, Card, ConfirmDialog, EmptyState, Field, IconButton, Select, TextInput, useDisclosure,
} from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/useToast';
import { uid } from '@/utils/id';

export default function BudgetPage() {
  const toast = useToast();
  const addSheet = useDisclosure();
  const fuelSheet = useDisclosure();
  const [toDelete, setToDelete] = useState<Expense | null>(null);
  const expenses = useLiveQuery(() => db.expenses.toArray(), []);
  const today = bangkokToday();
  const stats = computeExpenseStats(expenses ?? [], today);
  const maxCat = stats.byCategory[0]?.total ?? 1;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Budget"
        subtitle="Devise : THB (฿)"
        action={
          <Button onClick={addSheet.onOpen} className="!min-h-[40px] !px-3 text-xs">
            <Plus size={15} /> Dépense
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center">
          <p className="text-lg font-extrabold text-primary">{formatTHB(stats.today)}</p>
          <p className="text-[11px] font-semibold text-ink-3">Aujourd'hui</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-extrabold text-primary">{formatTHB(stats.total)}</p>
          <p className="text-[11px] font-semibold text-ink-3">Total</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-extrabold text-primary">{formatTHB(stats.perDay)}</p>
          <p className="text-[11px] font-semibold text-ink-3">Moyenne / jour</p>
        </Card>
      </div>

      <Button variant="accent" full onClick={fuelSheet.onOpen}>
        <Fuel size={17} /> + Essence
      </Button>

      {stats.byCategory.length > 0 && (
        <Card>
          <p className="mb-3 text-sm font-bold">Répartition par catégorie</p>
          <div className="space-y-2.5">
            {stats.byCategory.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{EXPENSE_CATEGORY_LABELS[c.category]}</span>
                  <span className="text-ink-3">
                    {formatTHB(c.total)} · {c.percent} %
                  </span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max((c.total / maxCat) * 100, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {expenses && expenses.length === 0 ? (
        <EmptyState
          icon={<Wallet size={26} />}
          title="Aucune dépense pour le moment"
          subtitle="Ajoutez vos dépenses en bahts au fil du voyage."
          action={
            <Button onClick={addSheet.onOpen}>
              <Plus size={16} /> Ajouter une dépense
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {(expenses ?? [])
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((e) => (
              <Card key={e.id} className="flex items-center gap-3 !p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">
                    {EXPENSE_CATEGORY_LABELS[e.category]}
                    {e.comment && <span className="font-normal text-ink-2"> · {e.comment}</span>}
                  </p>
                  <p className="text-xs text-ink-3">
                    {frenchDateShort(e.date)}
                    {e.place && ` · ${e.place}`}
                    {e.liters !== undefined && ` · ${e.liters} L`}
                  </p>
                </div>
                <p className="shrink-0 text-base font-extrabold">{formatTHB(e.amount)}</p>
                <IconButton label="Supprimer" className="h-9 w-9 shrink-0" onClick={() => setToDelete(e)}>
                  <Trash2 size={15} />
                </IconButton>
              </Card>
            ))}
        </div>
      )}

      <AddExpenseSheet open={addSheet.open} onClose={addSheet.onClose} />
      <FuelSheet open={fuelSheet.open} onClose={fuelSheet.onClose} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer la dépense ?"
        message={toDelete ? `${formatTHB(toDelete.amount)} — ${EXPENSE_CATEGORY_LABELS[toDelete.category]}` : ''}
        confirmLabel="Supprimer"
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await db.expenses.delete(toDelete.id);
          setToDelete(null);
          toast('Dépense supprimée');
        }}
      />
    </div>
  );
}

export function AddExpenseSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('nourriture');
  const [place, setPlace] = useState('');
  const [comment, setComment] = useState('');

  return (
    <BottomSheet open={open} onClose={onClose} title="Ajouter une dépense">
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const value = Number(amount);
          if (!value || value <= 0) return;
          await db.expenses.put({
            id: uid('exp'),
            amount: value,
            category,
            date: bangkokToday(),
            place: place || undefined,
            comment: comment || undefined,
            createdAt: new Date().toISOString(),
          });
          setAmount('');
          setPlace('');
          setComment('');
          onClose();
          toast('Dépense ajoutée');
        }}
      >
        <Field label="Montant (฿)">
          <TextInput
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="250"
            required
            autoFocus
          />
        </Field>
        <Field label="Catégorie">
          <Select value={category} onChange={(e) => setCategory(e.target.value as Expense['category'])}>
            {Object.entries(EXPENSE_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Lieu (optionnel)">
            <TextInput value={place} onChange={(e) => setPlace(e.target.value)} />
          </Field>
          <Field label="Commentaire">
            <TextInput value={comment} onChange={(e) => setComment(e.target.value)} />
          </Field>
        </div>
        <Button full type="submit">
          Ajouter
        </Button>
      </form>
    </BottomSheet>
  );
}

/** Ajout rapide essence → budget catégorie essence. */
function FuelSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [amount, setAmount] = useState('');
  const [liters, setLiters] = useState('');
  const [place, setPlace] = useState('');

  return (
    <BottomSheet open={open} onClose={onClose} title="⛽ Plein d'essence">
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const value = Number(amount);
          if (!value || value <= 0) return;
          await db.expenses.put({
            id: uid('exp'),
            amount: value,
            category: 'essence',
            date: bangkokToday(),
            place: place || undefined,
            liters: liters ? Number(liters) : undefined,
            comment: 'Essence',
            createdAt: new Date().toISOString(),
          });
          setAmount('');
          setLiters('');
          setPlace('');
          onClose();
          toast('Essence ajoutée au budget');
        }}
      >
        <Field label="Montant (฿)">
          <TextInput
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="120"
            required
            autoFocus
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Litres (optionnel)">
            <TextInput type="number" inputMode="decimal" step="any" value={liters} onChange={(e) => setLiters(e.target.value)} />
          </Field>
          <Field label="Lieu (optionnel)">
            <TextInput value={place} onChange={(e) => setPlace(e.target.value)} />
          </Field>
        </div>
        <Button full type="submit">
          Ajouter
        </Button>
      </form>
    </BottomSheet>
  );
}
