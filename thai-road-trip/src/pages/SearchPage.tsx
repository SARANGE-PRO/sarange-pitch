import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { db } from '@/db';
import { Card, EmptyState, TextInput, Badge } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';

interface SearchResult {
  type: string;
  title: string;
  subtitle?: string;
  to?: string;
}

/** Recherche globale : lieux, activités, notes, hébergements, transports. */
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const data = useLiveQuery(async () => {
    const [places, activities, notes, accommodations, transports] = await Promise.all([
      db.places.toArray(),
      db.activities.toArray(),
      db.notes.toArray(),
      db.accommodations.toArray(),
      db.transports.toArray(),
    ]);
    return { places, activities, notes, accommodations, transports };
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q || !data) return [];
    const match = (...fields: (string | undefined)[]) =>
      fields.some((f) => f?.toLowerCase().includes(q));
    const out: SearchResult[] = [];
    for (const p of data.places)
      if (match(p.name, p.localName, p.description))
        out.push({ type: 'Lieu', title: p.name, subtitle: p.description.slice(0, 80), to: `/lieu/${p.id}` });
    for (const a of data.activities)
      if (match(a.title, a.description))
        out.push({ type: 'Activité', title: a.title, subtitle: a.description?.slice(0, 80), to: `/jour/${a.dayId}` });
    for (const n of data.notes)
      if (match(n.text, n.place)) out.push({ type: 'Note', title: n.text.slice(0, 60), subtitle: n.place, to: '/notes' });
    for (const h of data.accommodations)
      if (match(h.city, h.name, h.address))
        out.push({ type: 'Hébergement', title: h.name ?? h.city, subtitle: h.date, to: '/hebergements' });
    for (const t of data.transports)
      if (match(t.origin, t.destination, t.company, t.number))
        out.push({ type: 'Transport', title: `${t.origin} → ${t.destination}`, subtitle: t.date, to: '/transports' });
    return out.slice(0, 40);
  }, [query, data]);

  return (
    <div className="space-y-4">
      <PageHeader back title="Recherche" />
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
        <TextInput
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Lieux, activités, notes, hôtels, vols…"
          className="!pl-10"
          aria-label="Recherche globale"
        />
      </div>
      {query.trim() === '' ? (
        <EmptyState icon={<Search size={26} />} title="Tapez pour rechercher" subtitle="La recherche couvre tout le contenu de l'application, hors connexion incluse." />
      ) : results.length === 0 ? (
        <EmptyState icon={<Search size={26} />} title="Aucun résultat" subtitle={`Rien ne correspond à « ${query} ».`} />
      ) : (
        <div className="space-y-2">
          {results.map((r, i) => (
            <Link key={i} to={r.to ?? '#'} className="block">
              <Card className="flex items-center gap-3 !p-3.5">
                <Badge tone="primary">{r.type}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{r.title}</p>
                  {r.subtitle && <p className="truncate text-xs text-ink-3">{r.subtitle}</p>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
