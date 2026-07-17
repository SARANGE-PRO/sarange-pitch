'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PhotoCredit } from '@/lib/types';

interface Props {
  photos: PhotoCredit[];
  index: number | null;
  alt: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}

/** Visionneuse plein écran : photo en grand (object-contain) + crédit + navigation. */
export function PhotoLightbox({ photos, index, alt, onClose, onIndex }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const open = index !== null;
  const count = photos.length;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onIndex((index + dir + count) % count);
    },
    [index, count, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  if (index === null || !mounted) return null;
  const photo = photos[index];
  if (!photo) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo en plein écran"
      className="fixed inset-0 z-[100] flex flex-col bg-night/95 backdrop-blur-sm"
    >
      {/* zone cliquable de fermeture */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out"
      />

      <div className="pointer-events-none relative z-10 flex flex-1 items-center justify-center p-4 sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={alt}
          className="pointer-events-auto max-h-[82vh] max-w-full rounded-[var(--radius)] object-contain shadow-2xl"
        />
      </div>

      {/* barre de contrôle */}
      <div className="relative z-10 flex items-center justify-between gap-4 border-t border-line bg-night/70 px-4 py-3 sm:px-8">
        <a
          href={photo.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 font-mono text-[11px] leading-relaxed text-sand hover:text-gold"
        >
          © {photo.photographer} · {photo.license}
          {photo.approximate && (
            <span className="text-sand/70"> · illustration ({photo.depicts})</span>
          )}
        </a>
        <div className="flex shrink-0 items-center gap-2">
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Photo précédente"
                onClick={() => go(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ivory hover:border-gold/50 hover:text-gold"
              >
                ‹
              </button>
              <span className="font-mono text-xs text-sand">
                {index + 1}/{count}
              </span>
              <button
                type="button"
                aria-label="Photo suivante"
                onClick={() => go(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ivory hover:border-gold/50 hover:text-gold"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>

      {/* bouton fermer */}
      <button
        ref={closeRef}
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-lacquer text-ivory hover:border-gold/50 hover:text-gold"
      >
        ✕
      </button>
    </div>,
    document.body,
  );
}
