'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

/**
 * Animation d'ouverture (splash) — se joue une fois par session au lancement,
 * puis fond en fondu vers l'app. Dégradation gracieuse : si la vidéo ne peut
 * pas être lue (codec/navigateur), on révèle l'app immédiatement. Respecte
 * prefers-reduced-motion (via le script inline qui pilote #intro-cover).
 */
const SEEN_KEY = 'koiko:intro-seen';

function removeCover() {
  document.getElementById('intro-cover')?.remove();
}

function shouldPlayIntro() {
  return (window as unknown as { __koikoIntro?: boolean }).__koikoIntro === true;
}

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'leaving' | 'done'>('done');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!shouldPlayIntro()) {
      removeCover();
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* stockage indisponible : on joue quand même une fois */
    }
    setPhase('playing');
  }, []);

  // Verrouille le défilement pendant l'intro.
  useEffect(() => {
    if (phase === 'done') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  const leave = () => setPhase((p) => (p === 'playing' ? 'leaving' : p));

  // Lancement + filets de sécurité (échec de lecture, durée max).
  useEffect(() => {
    if (phase !== 'playing') return;
    const v = videoRef.current;
    const maxT = setTimeout(leave, 9000);
    const p = v?.play?.();
    if (p && typeof p.then === 'function') p.catch(leave);
    return () => clearTimeout(maxT);
  }, [phase]);

  // Sortie : révèle l'app derrière le fondu, puis démonte.
  useEffect(() => {
    if (phase !== 'leaving') return;
    removeCover();
    const t = setTimeout(() => setPhase('done'), 620);
    return () => clearTimeout(t);
  }, [phase]);

  if (!mounted || phase === 'done') return null;

  return createPortal(
    <div
      role="dialog"
      aria-label="Animation d'ouverture KoïKoSamui"
      onClick={leave}
      className={cn(
        'fixed inset-0 z-[200] flex items-center justify-center bg-night transition-opacity duration-[600ms] ease-out',
        phase === 'leaving' ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      <div className="relative h-full w-full overflow-hidden lg:h-auto lg:aspect-[9/16] lg:max-h-[94vh] lg:w-auto lg:rounded-[22px] lg:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        <video
          ref={videoRef}
          src="/brand/intro.mov"
          muted
          autoPlay
          playsInline
          preload="auto"
          onEnded={leave}
          onError={leave}
          className="h-full w-full object-cover"
        />

        {/* Dégradé bas : masque la marque de génération + assoit le bouton */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-night via-night/55 to-transparent"
          aria-hidden
        />

        {/* Bouton « Passer » — verre premium doré */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            leave();
          }}
          aria-label="Passer l'animation d'ouverture"
          style={{
            bottom: 'max(1.25rem, calc(0.75rem + env(safe-area-inset-bottom)))',
          }}
          className="group absolute right-5 z-10 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory shadow-[0_6px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-200 hover:border-gold/70 hover:bg-white/[0.16] hover:text-gold active:scale-95"
        >
          Passer
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M7 5l6 7-6 7M14 5l6 7-6 7" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
