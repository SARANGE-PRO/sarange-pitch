import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { db } from '@/db';
import { resetTrip } from '@/db/seed';
import { exportBackup, importBackup, validateBackup } from '@/db/backup';
import { useSettings, updateSettings } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';
import { requestNotificationPermission } from '@/services/notifications';
import { Button, Card, ConfirmDialog, Segmented, Toggle, useDisclosure } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/hooks/useToast';

export default function SettingsPage() {
  const settings = useSettings();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const confirmReset1 = useDisclosure();
  const confirmReset2 = useDisclosure();
  const [pendingImport, setPendingImport] = useState<unknown | null>(null);

  const doExport = async () => {
    const payload = await exportBackup(db);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thai-road-trip-sauvegarde-${payload.exportedAt.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Sauvegarde exportée');
  };

  return (
    <div className="space-y-4">
      <PageHeader back title="Réglages" />

      <Card>
        <p className="mb-2 text-sm font-bold">Thème</p>
        <Segmented
          options={[
            { value: 'light', label: 'Clair' },
            { value: 'dark', label: 'Sombre' },
            { value: 'system', label: 'Système' },
          ]}
          value={theme}
          onChange={setTheme}
        />
      </Card>

      <Card>
        <p className="mb-2 text-sm font-bold">Unité de distance</p>
        <Segmented
          options={[
            { value: 'km', label: 'Kilomètres' },
            { value: 'mi', label: 'Miles' },
          ]}
          value={settings.distanceUnit}
          onChange={(v) => updateSettings({ distanceUnit: v })}
        />
      </Card>

      <Card>
        <p className="mb-2 text-sm font-bold">Météo</p>
        <Segmented
          options={[
            { value: 'auto', label: 'Automatique (Open-Meteo)' },
            { value: 'manual', label: 'Manuelle' },
          ]}
          value={settings.weatherMode}
          onChange={(v) => updateSettings({ weatherMode: v })}
        />
        <p className="mt-2 text-xs text-ink-3">
          Le mode automatique utilise Open-Meteo, gratuit et sans clé API. Le mode manuel permet de saisir la météo
          observée sur place.
        </p>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Position GPS</p>
            <p className="text-xs text-ink-3">Position sur la carte et détection d'arrivée</p>
          </div>
          <Toggle checked={settings.gpsEnabled} onChange={(v) => updateSettings({ gpsEnabled: v })} label="GPS" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Notifications locales</p>
            <p className="text-xs text-ink-3">Rappels départ, vols, check-out (opt-in)</p>
          </div>
          <Toggle
            checked={settings.notificationsEnabled}
            onChange={async (v) => {
              if (v) {
                const granted = await requestNotificationPermission();
                if (!granted) {
                  toast('Notifications refusées par le navigateur');
                  return;
                }
              }
              await updateSettings({ notificationsEnabled: v });
            }}
            label="Notifications"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Inclure les activités ignorées dans « À rattraper »</p>
            <p className="text-xs text-ink-3">En plus des activités reportées</p>
          </div>
          <Toggle
            checked={settings.includeSkippedInCatchUp}
            onChange={(v) => updateSettings({ includeSkippedInCatchUp: v })}
            label="Inclure ignorées"
          />
        </div>
      </Card>

      <Card className="space-y-2">
        <p className="text-sm font-bold">Sauvegarde</p>
        <Button variant="secondary" full onClick={doExport}>
          <Download size={16} /> Exporter le voyage (JSON)
        </Button>
        <Button variant="secondary" full onClick={() => fileInput.current?.click()}>
          <Upload size={16} /> Importer une sauvegarde
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            try {
              const raw = JSON.parse(await file.text()) as unknown;
              if (!validateBackup(raw)) {
                toast('Fichier de sauvegarde invalide');
                return;
              }
              setPendingImport(raw);
            } catch {
              toast('Fichier illisible');
            }
          }}
        />
        <p className="text-xs text-ink-3">
          L'export contient itinéraire, notes, budget, checklist, réservations, hébergements, transports, favoris et
          progression.
        </p>
      </Card>

      <Card>
        <p className="text-sm font-bold text-danger">Zone dangereuse</p>
        <Button variant="danger" full className="mt-2" onClick={confirmReset1.onOpen}>
          Réinitialiser le voyage
        </Button>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingImport)}
        title="Importer la sauvegarde ?"
        message="Les données actuelles seront remplacées par celles de la sauvegarde. Cette action est irréversible."
        confirmLabel="Importer"
        onCancel={() => setPendingImport(null)}
        onConfirm={async () => {
          if (pendingImport && validateBackup(pendingImport)) {
            await importBackup(db, pendingImport);
            toast('Sauvegarde importée');
          }
          setPendingImport(null);
        }}
      />
      <ConfirmDialog
        open={confirmReset1.open}
        title="Réinitialiser le voyage ?"
        message="Toutes vos données (statuts, notes, budget, photos, réservations…) seront effacées et l'itinéraire d'origine restauré."
        confirmLabel="Continuer"
        onCancel={confirmReset1.onClose}
        onConfirm={() => {
          confirmReset1.onClose();
          confirmReset2.onOpen();
        }}
      />
      <ConfirmDialog
        open={confirmReset2.open}
        title="Dernière confirmation"
        message="Cette action est définitive. Pensez à exporter une sauvegarde avant. Réinitialiser maintenant ?"
        confirmLabel="Tout effacer"
        onCancel={confirmReset2.onClose}
        onConfirm={async () => {
          confirmReset2.onClose();
          await resetTrip(db);
          toast('Voyage réinitialisé');
        }}
      />
    </div>
  );
}
