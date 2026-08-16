import { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { Camera, Compass, Heart, Pencil, Share2, Star, Trash2 } from 'lucide-react';
import { db } from '@/db';
import { Badge, Button, Card, Field, IconButton, TextArea, useDisclosure, ConfirmDialog } from '@/components/ui';
import { CATEGORY_META } from '@/components/ui/CategoryIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { openNavigation } from '@/services/navigation';
import { shareContent, sharePlaceText } from '@/services/share';
import { addPhoto, deletePhoto } from '@/services/photos';
import { useToast } from '@/hooks/useToast';
import { minutesToHuman } from '@/utils/datetime';
import { PhotoGrid } from '@/components/PhotoGrid';

/** Fiche détaillée d'un lieu. */
export default function PlaceDetailPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const confirmDelete = useDisclosure();

  const place = useLiveQuery(async () => (placeId ? db.places.get(placeId) : undefined), [placeId]);
  const activities = useLiveQuery(
    async () => (placeId ? db.activities.where('placeId').equals(placeId).toArray() : []),
    [placeId],
  );

  if (!place) return <div className="skeleton h-40" />;
  const meta = CATEGORY_META[place.category] ?? CATEGORY_META.other;

  return (
    <div className="space-y-4">
      <PageHeader
        back
        title={place.name}
        subtitle={place.localName}
        action={
          <IconButton
            label={place.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={async () => {
              await db.places.update(place.id, { favorite: !place.favorite });
              toast(place.favorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
            }}
          >
            <Heart size={22} className={place.favorite ? 'fill-danger text-danger' : ''} />
          </IconButton>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="primary">
          {meta.emoji} {meta.label}
        </Badge>
        {place.recommendedDuration !== undefined && <Badge>~ {minutesToHuman(place.recommendedDuration)}</Badge>}
        {place.priority === 'must' && <Badge tone="accent">Incontournable</Badge>}
        {place.weatherSensitive && <Badge tone="warn">🌧 météo-sensible</Badge>}
        {place.personalRating !== undefined && (
          <Badge tone="accent">
            <Star size={11} className="fill-current" /> {place.personalRating}/5
          </Badge>
        )}
      </div>

      <Card>
        <p className="text-sm leading-relaxed text-ink-2">{place.description || 'Aucune description.'}</p>
        {place.interest && (
          <p className="mt-2 text-sm text-ink-2">
            <strong>Intérêt :</strong> {place.interest}
          </p>
        )}
        <dl className="mt-3 space-y-1.5 text-sm">
          {place.openingHours && <InfoRow label="Horaires" value={place.openingHours} />}
          {place.price && <InfoRow label="Tarif" value={place.price} />}
          <InfoRow label="GPS" value={`${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`} />
        </dl>
        {place.tips && <p className="mt-3 rounded-xl bg-accent-soft p-3 text-sm text-accent">💡 {place.tips}</p>}
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => openNavigation(place.latitude, place.longitude)}>
          <Compass size={16} /> Naviguer
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            shareContent(sharePlaceText(place.name, place.latitude, place.longitude)).then((ok) => ok && toast('Partagé'))
          }
        >
          <Share2 size={16} /> Partager
        </Button>
        <Button variant="secondary" onClick={() => fileInput.current?.click()}>
          <Camera size={16} /> Ajouter une photo
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setNotesDraft(place.notes ?? '');
            setEditingNotes(true);
          }}
        >
          <Pencil size={16} /> Note du lieu
        </Button>
        {place.userAdded && (
          <Button variant="danger" className="col-span-2" onClick={confirmDelete.onOpen}>
            <Trash2 size={16} /> Supprimer ce lieu
          </Button>
        )}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            await addPhoto('place', place.id, file);
            toast('Photo enregistrée');
          }
          e.target.value = '';
        }}
      />

      {editingNotes && (
        <Card>
          <Field label="Vos notes sur ce lieu">
            <TextArea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} />
          </Field>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" full onClick={() => setEditingNotes(false)}>
              Annuler
            </Button>
            <Button
              full
              onClick={async () => {
                await db.places.update(place.id, { notes: notesDraft || undefined });
                setEditingNotes(false);
                toast('Note enregistrée');
              }}
            >
              Enregistrer
            </Button>
          </div>
        </Card>
      )}
      {!editingNotes && place.notes && (
        <Card>
          <p className="text-xs font-bold uppercase text-ink-3">Vos notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink-2">{place.notes}</p>
        </Card>
      )}

      <PhotoGrid refType="place" refId={place.id} onDelete={(id) => deletePhoto(id).then(() => toast('Photo supprimée'))} />

      {activities && activities.length > 0 && (
        <Card>
          <p className="mb-2 text-sm font-bold">Au programme</p>
          {activities.map((a) => (
            <p key={a.id} className="text-sm text-ink-2">
              • {a.title} {a.plannedStartTime && `· ${a.plannedStartTime}`}
            </p>
          ))}
        </Card>
      )}

      <ConfirmDialog
        open={confirmDelete.open}
        title="Supprimer ce lieu ?"
        message={`« ${place.name} » sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        onCancel={confirmDelete.onClose}
        onConfirm={async () => {
          await db.places.delete(place.id);
          confirmDelete.onClose();
          history.back();
          toast('Lieu supprimé');
        }}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 font-semibold text-ink-3">{label}</dt>
      <dd className="text-ink-2">{value}</dd>
    </div>
  );
}
