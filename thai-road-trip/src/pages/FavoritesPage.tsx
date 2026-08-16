import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { db } from '@/db';
import { Card, EmptyState, Badge } from '@/components/ui';
import { CATEGORY_META } from '@/components/ui/CategoryIcon';
import { PageHeader } from '@/components/layout/PageHeader';

export default function FavoritesPage() {
  const favorites = useLiveQuery(
    async () => (await db.places.toArray()).filter((p) => p.favorite),
    [],
  );
  const favoriteNotes = useLiveQuery(
    async () => (await db.notes.toArray()).filter((n) => n.favorite),
    [],
  );

  const empty = favorites?.length === 0 && favoriteNotes?.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader back title="Favoris" />
      {empty ? (
        <EmptyState
          icon={<Heart size={26} />}
          title="Aucun favori pour le moment"
          subtitle="Ajoutez des lieux, cafés, restaurants ou notes en favoris avec le cœur."
        />
      ) : (
        <>
          {favorites && favorites.length > 0 && (
            <div className="space-y-2">
              {favorites.map((p) => {
                const meta = CATEGORY_META[p.category] ?? CATEGORY_META.other;
                return (
                  <Link key={p.id} to={`/lieu/${p.id}`} className="block">
                    <Card className="flex items-center gap-3 !p-3.5">
                      <span className="text-xl">{meta.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{p.name}</p>
                        <p className="truncate text-xs text-ink-3">{meta.label}</p>
                      </div>
                      {p.personalRating !== undefined && (
                        <Badge tone="accent">
                          <Star size={11} className="fill-current" /> {p.personalRating}
                        </Badge>
                      )}
                      <Heart size={16} className="fill-danger text-danger" />
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
          {favoriteNotes && favoriteNotes.length > 0 && (
            <section>
              <h2 className="mb-2 text-base font-extrabold">Notes favorites</h2>
              <div className="space-y-2">
                {favoriteNotes.map((n) => (
                  <Card key={n.id} className="!p-3.5">
                    <p className="text-sm">{n.text}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
