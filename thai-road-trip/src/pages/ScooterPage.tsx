import { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Bike, Camera } from 'lucide-react';
import { db } from '@/db';
import type { ScooterRental } from '@/types';
import { Button, Card, Field, TextArea, TextInput } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { addPhoto, deletePhoto } from '@/services/photos';
import { PhotoGrid } from '@/components/PhotoGrid';
import { useToast } from '@/hooks/useToast';

const RENTAL_ID = 'scooter-main';

/** Fiche location scooter : loueur, dépôt, état, photos avant départ. */
export default function ScooterPage() {
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const rental = useLiveQuery(() => db.scooter.get(RENTAL_ID), []);
  const [form, setForm] = useState<Record<string, string>>({});
  const value = (key: keyof ScooterRental) => form[key] ?? String(rental?.[key] ?? '');

  return (
    <div className="space-y-4">
      <PageHeader back title="Location scooter" subtitle="Fiche loueur + photos d'état avant départ" />

      <Card className="border-l-4 border-accent">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Camera size={16} className="text-accent" /> Photos avant de partir
        </p>
        <p className="mt-1 text-xs text-ink-2">
          Photographiez le scooter sous tous les angles à la prise (rayures, compteur, niveau d'essence). Ces photos
          restent stockées dans l'application, même hors connexion.
        </p>
        <Button variant="accent" full className="mt-3" onClick={() => fileInput.current?.click()}>
          <Camera size={16} /> Ajouter des photos
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = [...(e.target.files ?? [])];
            for (const file of files) await addPhoto('scooter', RENTAL_ID, file);
            if (files.length) toast(`${files.length} photo${files.length > 1 ? 's' : ''} enregistrée${files.length > 1 ? 's' : ''}`);
            e.target.value = '';
          }}
        />
      </Card>

      <PhotoGrid refType="scooter" refId={RENTAL_ID} onDelete={(id) => deletePhoto(id).then(() => toast('Photo supprimée'))} />

      <Card>
        <p className="mb-3 flex items-center gap-2 text-sm font-bold">
          <Bike size={16} className="text-primary" /> Informations de location
        </p>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await db.scooter.put({
              id: RENTAL_ID,
              shopName: value('shopName') || undefined,
              contact: value('contact') || undefined,
              model: value('model') || undefined,
              plate: value('plate') || undefined,
              pricePerDay: value('pricePerDay') ? Number(value('pricePerDay')) : undefined,
              deposit: value('deposit') ? Number(value('deposit')) : undefined,
              pickupDate: value('pickupDate') || undefined,
              returnDate: value('returnDate') || undefined,
              fuelLevel: value('fuelLevel') || undefined,
              existingDamage: value('existingDamage') || undefined,
              notes: value('notes') || undefined,
            });
            setForm({});
            toast('Fiche scooter enregistrée');
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Loueur">
              <TextInput value={value('shopName')} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
            </Field>
            <Field label="Contact">
              <TextInput value={value('contact')} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Modèle">
              <TextInput value={value('model')} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Ex : Honda Click 125" />
            </Field>
            <Field label="Plaque">
              <TextInput value={value('plate')} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix / jour (฿)">
              <TextInput type="number" inputMode="decimal" value={value('pricePerDay')} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} />
            </Field>
            <Field label="Dépôt (฿)">
              <TextInput type="number" inputMode="decimal" value={value('deposit')} onChange={(e) => setForm({ ...form, deposit: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date de prise">
              <TextInput type="date" value={value('pickupDate')} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} />
            </Field>
            <Field label="Date de retour">
              <TextInput type="date" value={value('returnDate')} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} />
            </Field>
          </div>
          <Field label="Niveau de carburant à la prise">
            <TextInput value={value('fuelLevel')} onChange={(e) => setForm({ ...form, fuelLevel: e.target.value })} placeholder="Ex : 3/4 de réservoir" />
          </Field>
          <Field label="Dégâts existants">
            <TextArea value={value('existingDamage')} onChange={(e) => setForm({ ...form, existingDamage: e.target.value })} placeholder="Rayure aile avant droite…" />
          </Field>
          <Field label="Notes">
            <TextInput value={value('notes')} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <Button full type="submit">
            Enregistrer
          </Button>
        </form>
      </Card>
    </div>
  );
}
