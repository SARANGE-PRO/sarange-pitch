'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  Category,
  DangerLevel,
  ObservationZone,
  Species,
} from '@/lib/types';
import {
  EMPTY_FILTER,
  applyFilter,
  filterToSearchParams,
  isFilterActive,
  type SpeciesFilter,
} from '@/lib/filters';
import { CATEGORIES } from '@/data/taxonomy';
import { FilterBar } from './FilterBar';
import { SpeciesGrid } from './SpeciesGrid';

const STORAGE_KEY = 'koiko:especes';

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function sameFilter(a?: SpeciesFilter, b?: SpeciesFilter): boolean {
  return (
    !!a &&
    !!b &&
    filterToSearchParams(a).toString() === filterToSearchParams(b).toString()
  );
}

export function SpeciesExplorer({
  species,
  initialFilter,
}: {
  species: Species[];
  initialFilter: SpeciesFilter;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<SpeciesFilter>(initialFilter);
  const restored = useRef(false);
  const skipFirstSave = useRef(true);
  const skipRestoreSave = useRef(false);
  const pendingScroll = useRef<number | null>(null);

  const filterRef = useRef(filter);
  filterRef.current = filter;

  // Écrit filtre + position de scroll courants en session.
  const save = (scroll = window.scrollY) => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ filter: filterRef.current, scroll }),
      );
    } catch {
      /* sessionStorage indisponible */
    }
  };

  // ------- Restauration au montage (retour navigateur / re-navigation) -------
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    let saved: { filter?: SpeciesFilter; scroll?: number } | undefined;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    if (!saved) return;

    const urlActive = isFilterActive(initialFilter);
    if (!urlActive && saved.filter) {
      skipRestoreSave.current = true; // ne pas ré-écrire pendant la restauration
      setFilter(saved.filter);
    }
    const effective = urlActive ? initialFilter : saved.filter ?? initialFilter;
    if (typeof saved.scroll === 'number' && sameFilter(saved.filter, effective)) {
      pendingScroll.current = saved.scroll;
    }
  }, [initialFilter]);

  const filtered = useMemo(
    () => applyFilter(species, filter),
    [species, filter],
  );
  const active = isFilterActive(filter);

  // Restaure le scroll après peinture, ré-appliqué ~650 ms pour l'emporter sur
  // la restauration native, annulé dès que l'utilisateur défile.
  useEffect(() => {
    if (pendingScroll.current == null) return;
    const y = pendingScroll.current;
    pendingScroll.current = null;
    let cancelled = false;
    const apply = () => {
      if (!cancelled)
        window.scrollTo({ top: y, left: 0, behavior: 'instant' as ScrollBehavior });
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(
          e.key,
        )
      )
        stop();
    };
    const cleanup = () => {
      clearInterval(iv);
      clearTimeout(end);
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', onKey);
    };
    const stop = () => {
      cancelled = true;
      cleanup();
    };
    const raf = requestAnimationFrame(() => requestAnimationFrame(apply));
    const iv = setInterval(apply, 60);
    const end = setTimeout(stop, 650);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', onKey);
    return cleanup;
  }, [filtered]);

  // Persiste filtre + scroll : sauvegarde immédiate au changement de filtre
  // (sauf montage / restauration) + suivi du scroll (throttlé).
  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
    } else if (skipRestoreSave.current) {
      skipRestoreSave.current = false;
    } else {
      save();
    }
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => save(), 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Synchronise l'URL (filtres partageables) — remplacement débounced.
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = filterToSearchParams(filter).toString();
      router.replace(qs ? `/especes?${qs}` : '/especes', { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [filter, router]);

  const grouped = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        cat,
        items: filtered.filter((s) => s.category === cat.key),
      })).filter((g) => g.items.length > 0),
    [filtered],
  );

  // Fige la position EXACTE au moment du clic sur une carte (avant tout
  // défilement provoqué par la navigation).
  const handleNavigateAway = () => save(window.scrollY);

  return (
    <div className="flex flex-col gap-8">
      <FilterBar
        filter={filter}
        count={filtered.length}
        total={species.length}
        active={active}
        onToggleCategory={(c: Category) =>
          setFilter((f) => ({ ...f, categories: toggle(f.categories, c) }))
        }
        onToggleDanger={(d: DangerLevel) =>
          setFilter((f) => ({ ...f, dangers: toggle(f.dangers, d) }))
        }
        onToggleZone={(z: ObservationZone) =>
          setFilter((f) => ({ ...f, zones: toggle(f.zones, z) }))
        }
        onQuery={(q: string) => setFilter((f) => ({ ...f, query: q }))}
        onReset={() => setFilter(EMPTY_FILTER)}
      />

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} espèce{filtered.length > 1 ? 's' : ''} affichée
        {filtered.length > 1 ? 's' : ''} sur {species.length}.
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-line py-20 text-center">
          <p className="font-mono text-sm text-sand">
            Aucun spécimen ne correspond à ces filtres.
          </p>
          <button
            type="button"
            onClick={() => setFilter(EMPTY_FILTER)}
            className="rounded-full border border-gold/50 px-4 py-2 font-ui text-sm text-gold transition-colors hover:bg-gold/10 active:scale-95"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10" onClickCapture={handleNavigateAway}>
          {grouped.map(({ cat, items }) => (
            <section key={cat.key} aria-labelledby={`grp-${cat.key}`}>
              <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
                <h2
                  id={`grp-${cat.key}`}
                  className="font-display text-xl font-semibold text-ivory"
                >
                  {cat.icon} {cat.label}
                </h2>
                <span className="font-mono text-xs text-sand">
                  ({items.length})
                </span>
              </div>
              <SpeciesGrid species={items} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
