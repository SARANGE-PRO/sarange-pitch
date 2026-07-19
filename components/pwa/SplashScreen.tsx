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
      <video
        ref={videoRef}
        src="/brand/intro.mov"
        muted
        autoPlay
        playsInline
        preload="auto"
        onEnded={leave}
        onError={leave}
        className="h-full w-full object-cover lg:object-contain"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          leave();
        }}
        aria-label="Passer l'animation d'ouverture"
        className="pb-safe absolute bottom-6 right-6 rounded-full border border-white/25 bg-black/35 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white/90 backdrop-blur-sm transition-colors hover:bg-black/55"
      >
        Passer ›
      </button>
    </div>,
    document.body,
  );
}
