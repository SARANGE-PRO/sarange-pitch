import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CloudRain, RefreshCw, Thermometer } from 'lucide-react';
import { db } from '@/db';
import { classifyWeather, fetchWeatherAuto, saveManualWeather } from '@/services/weather';
import { useSettings } from '@/hooks/useSettings';
import { useOnline } from '@/hooks/useOnline';
import { Badge, BottomSheet, Button, Field, Select, TextInput, useDisclosure } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

/**
 * Carte météo du jour. Mode auto : Open-Meteo (sans clé API).
 * Mode manuel : saisie rapide. Fonctionne offline avec le dernier snapshot.
 */
export function WeatherCard({
  date,
  latitude,
  longitude,
  compact = false,
}: {
  date: string;
  latitude: number;
  longitude: number;
  compact?: boolean;
}) {
  const settings = useSettings();
  const online = useOnline();
  const toast = useToast();
  const sheet = useDisclosure();
  const snapshot = useLiveQuery(() => db.weather.get(date), [date]);
  const [loading, setLoading] = useState(false);

  const refresh = async (silent = false) => {
    if (!online) return;
    setLoading(true);
    const result = await fetchWeatherAuto(latitude, longitude, date);
    setLoading(false);
    // Toast uniquement sur action manuelle : le rafraîchissement automatique
    // échoue silencieusement (l'app reste utilisable sans météo).
    if (!result && !silent) toast('Météo indisponible — saisie manuelle possible');
  };

  useEffect(() => {
    if (settings.weatherMode === 'auto' && online && !snapshot?.fetchedAt && snapshot?.source !== 'manual') {
      void refresh(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, settings.weatherMode, online]);

  const cls = classifyWeather(snapshot);

  return (
    <>
      <button
        onClick={sheet.onOpen}
        className={`flex w-full items-center gap-3 rounded-xl2 bg-surface text-left shadow-card transition-transform active:scale-[0.99] ${compact ? 'p-3' : 'p-4'}`}
        aria-label="Météo du jour"
      >
        <span className="text-2xl" aria-hidden>
          {cls.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">{cls.label}</span>
          <span className="block truncate text-xs text-ink-3">
            {snapshot?.condition ?? 'Toucher pour renseigner'}
            {snapshot?.temperature !== undefined && ` · ${Math.round(snapshot.temperature)} °C`}
            {snapshot?.rainProbability !== undefined && ` · pluie ${snapshot.rainProbability} %`}
          </span>
        </span>
        {settings.weatherMode === 'auto' && online && (
          <RefreshCw
            size={16}
            className={`text-ink-3 ${loading ? 'animate-spin' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              void refresh();
            }}
          />
        )}
      </button>
      <BottomSheet open={sheet.open} onClose={sheet.onClose} title="Météo">
        <ManualWeatherForm date={date} onSaved={sheet.onClose} />
        {settings.weatherMode === 'auto' && (
          <Button variant="secondary" full className="mt-3" disabled={!online} onClick={() => refresh()}>
            <RefreshCw size={16} /> Actualiser depuis Open-Meteo
          </Button>
        )}
      </BottomSheet>
    </>
  );
}

export function ManualWeatherForm({ date, onSaved }: { date: string; onSaved: () => void }) {
  const toast = useToast();
  const [temperature, setTemperature] = useState('');
  const [condition, setCondition] = useState('');
  const [rain, setRain] = useState('');
  const [heavy, setHeavy] = useState('non');
  const [comment, setComment] = useState('');

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await saveManualWeather({
          date,
          temperature: temperature ? Number(temperature) : undefined,
          condition: condition || undefined,
          rainProbability: rain ? Number(rain) : undefined,
          heavyRain: heavy === 'oui',
          comment: comment || undefined,
        });
        toast('Météo enregistrée');
        onSaved();
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Température (°C)">
          <TextInput
            type="number"
            inputMode="numeric"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="28"
          />
        </Field>
        <Field label="Pluie (%)">
          <TextInput
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={rain}
            onChange={(e) => setRain(e.target.value)}
            placeholder="40"
          />
        </Field>
      </div>
      <Field label="Météo">
        <TextInput value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Averses l'après-midi" />
      </Field>
      <Field label="Pluie forte ?">
        <Select value={heavy} onChange={(e) => setHeavy(e.target.value)}>
          <option value="non">Non</option>
          <option value="oui">Oui</option>
        </Select>
      </Field>
      <Field label="Commentaire">
        <TextInput value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optionnel" />
      </Field>
      <Button full type="submit">
        Enregistrer
      </Button>
    </form>
  );
}

export function WeatherInline({ date }: { date: string }) {
  const snapshot = useLiveQuery(() => db.weather.get(date), [date]);
  if (!snapshot) return null;
  const cls = classifyWeather(snapshot);
  return (
    <Badge tone={cls.level === 'good' ? 'ok' : cls.level === 'caution' ? 'warn' : cls.level === 'bad' ? 'danger' : 'neutral'}>
      {snapshot.rainProbability !== undefined ? (
        <>
          <CloudRain size={12} /> {snapshot.rainProbability} %
        </>
      ) : snapshot.temperature !== undefined ? (
        <>
          <Thermometer size={12} /> {Math.round(snapshot.temperature)} °C
        </>
      ) : (
        cls.label
      )}
    </Badge>
  );
}
