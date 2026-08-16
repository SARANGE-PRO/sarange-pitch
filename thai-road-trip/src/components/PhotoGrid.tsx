import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { X } from 'lucide-react';
import { db } from '@/db';
import type { Photo } from '@/types';

/** Grille de photos locales (IndexedDB / Blob) avec URLs objets gérées proprement. */
export function PhotoGrid({
  refType,
  refId,
  onDelete,
}: {
  refType: Photo['refType'];
  refId: string;
  onDelete?: (id: string) => void;
}) {
  const photos = useLiveQuery(
    () => db.photos.where('[refType+refId]').equals([refType, refId]).toArray(),
    [refType, refId],
  );
  const [urls, setUrls] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (!photos) return;
    const map = new Map<string, string>();
    for (const p of photos) map.set(p.id, URL.createObjectURL(p.blob));
    setUrls(map);
    return () => {
      for (const url of map.values()) URL.revokeObjectURL(url);
    };
  }, [photos]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((p) => (
        <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl bg-surface-2">
          {urls.get(p.id) && (
            <img src={urls.get(p.id)} alt="Photo enregistrée" className="h-full w-full object-cover" loading="lazy" />
          )}
          {onDelete && (
            <button
              aria-label="Supprimer la photo"
              onClick={() => onDelete(p.id)}
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
