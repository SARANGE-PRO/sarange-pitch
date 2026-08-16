import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Mountain, Pencil, Share2, Trash2 } from 'lucide-react';
import { db } from '@/db';
import type { Activity, Category } from '@/types';
import {
  BottomSheet, Button, ConfirmDialog, Field, Select, TextArea, TextInput, useDisclosure,
} from '@/components/ui';
import { CATEGORY_META, CategoryChip } from '@/components/ui/CategoryIcon';
import { StatusActions } from './StatusControls';
import { openNavigation } from '@/services/navigation';
import { shareContent, sharePlaceText } from '@/services/share';
import { useToast } from '@/hooks/useToast';
import { minutesToHuman } from '@/utils/datetime';

/** Bottom-sheet de détail + édition d'une activité. */
export function ActivitySheet({ activity, onClose }: { activity: Activity | null; onClose: () => void }) {
  const place = useLiveQuery(
    async () => (activity?.placeId ? db.places.get(activity.placeId) : undefined),
    [activity?.placeId],
  );
  const [editing, setEditing] = useState(false);
  const confirmDelete = useDisclosure();
  const toast = useToast();

  useEffect(() => setEditing(false), [activity?.id]);

  if (!activity) return null;
  const lat = activity.latitude ?? place?.latitude;
  const lon = activity.longitude ?? place?.longitude;
  const isHike = activity.category === 'hike';

  return (
    <>
      <BottomSheet open onClose={onClose} title={activity.title}>
        {editing ? (
          <ActivityEditForm
            activity={activity}
            onDone={() => {
              setEditing(false);
              toast('Activité modifiée');
            }}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip category={activity.category} />
              {activity.plannedStartTime && (
                <span className="text-sm font-semibold text-ink-2">{activity.plannedStartTime}</span>
              )}
              {activity.plannedDuration !== undefined && (
                <span className="text-sm text-ink-3">· {minutesToHuman(activity.plannedDuration)}</span>
              )}
              {activity.weatherSensitive && <span className="text-sm text-warn">🌧 météo-sensible</span>}
            </div>
            {(activity.description || place?.description) && (
              <p className="text-sm leading-relaxed text-ink-2">
                {activity.description ?? place?.description}
              </p>
            )}
            {place?.tips && <p className="rounded-xl bg-accent-soft p-3 text-sm text-accent">💡 {place.tips}</p>}
            {activity.actualStartTime && activity.actualEndTime && activity.plannedDuration !== undefined && (
              <p className="text-xs text-ink-3">
                Prévu {minutesToHuman(activity.plannedDuration)} — réel{' '}
                {minutesToHuman(
                  Math.max(
                    1,
                    Math.round(
                      (new Date(activity.actualEndTime).getTime() - new Date(activity.actualStartTime).getTime()) / 60000,
                    ),
                  ),
                )}
              </p>
            )}

            <StatusActions activity={activity} />

            <div className="grid grid-cols-2 gap-2">
              {lat !== undefined && lon !== undefined && (
                <Button variant="secondary" onClick={() => openNavigation(lat, lon)}>
                  <Compass size={16} /> Naviguer
                </Button>
              )}
              {place && (
                <Link to={`/lieu/${place.id}`} onClick={onClose}>
                  <Button variant="secondary" full>
                    <MapPin size={16} /> Fiche lieu
                  </Button>
                </Link>
              )}
              {isHike && (
                <Link to={`/rando/${activity.id}`} onClick={onClose} className="col-span-2">
                  <Button variant="accent" full>
                    <Mountain size={16} /> Mode randonnée
                  </Button>
                </Link>
              )}
              <Button
                variant="secondary"
                onClick={() => shareContent(sharePlaceText(activity.title, lat, lon)).then((ok) => ok && toast('Partagé'))}
              >
                <Share2 size={16} /> Partager
              </Button>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Pencil size={16} /> Modifier
              </Button>
              <Button variant="danger" className="col-span-2" onClick={confirmDelete.onOpen}>
                <Trash2 size={16} /> Supprimer l'activité
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
      <ConfirmDialog
        open={confirmDelete.open}
        title="Supprimer l'activité ?"
        message={`« ${activity.title} » sera définitivement supprimée du programme.`}
        confirmLabel="Supprimer"
        onCancel={confirmDelete.onClose}
        onConfirm={async () => {
          await db.activities.delete(activity.id);
          confirmDelete.onClose();
          onClose();
          toast('Activité supprimée');
        }}
      />
    </>
  );
}

export function ActivityEditForm({
  activity,
  onDone,
  days,
}: {
  activity: Activity;
  onDone: () => void;
  days?: { id: string; label: string }[];
}) {
  const allDays = useLiveQuery(() => db.days.orderBy('index').toArray(), []);
  const [title, setTitle] = useState(activity.title);
  const [category, setCategory] = useState<Category>(activity.category);
  const [start, setStart] = useState(activity.plannedStartTime ?? '');
  const [duration, setDuration] = useState(activity.plannedDuration?.toString() ?? '');
  const [description, setDescription] = useState(activity.description ?? '');
  const [dayId, setDayId] = useState(activity.dayId);
  const [sensitive, setSensitive] = useState(activity.weatherSensitive ? 'oui' : 'non');

  const dayOptions =
    days ?? allDays?.map((d) => ({ id: d.id, label: `J${d.index} · ${d.title}` })) ?? [];

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await db.activities.update(activity.id, {
          title: title.trim() || activity.title,
          category,
          plannedStartTime: start || undefined,
          plannedDuration: duration ? Number(duration) : undefined,
          description: description || undefined,
          dayId,
          weatherSensitive: sensitive === 'oui',
        });
        onDone();
      }}
    >
      <Field label="Titre">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Heure">
          <TextInput type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label="Durée (min)">
          <TextInput type="number" inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </Field>
      </div>
      <Field label="Catégorie">
        <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Jour">
        <Select value={dayId} onChange={(e) => setDayId(e.target.value)}>
          {dayOptions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Météo-sensible">
        <Select value={sensitive} onChange={(e) => setSensitive(e.target.value)}>
          <option value="non">Non</option>
          <option value="oui">Oui</option>
        </Select>
      </Field>
      <Field label="Description">
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Button full type="submit">
        Enregistrer
      </Button>
    </form>
  );
}
