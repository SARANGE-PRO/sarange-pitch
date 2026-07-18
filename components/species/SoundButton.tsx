'use client';

import { useRef, useState } from 'react';
import type { SoundClip } from '@/lib/types';
import { cn } from '@/lib/cn';

type State = 'idle' | 'loading' | 'playing' | 'error';

export function SoundButton({
  sound,
  name,
}: {
  sound: SoundClip;
  name: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<State>('idle');

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state === 'playing') {
      audio.pause();
      setState('idle');
      return;
    }
    setState('loading');
    audio.currentTime = 0;
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setState('playing')).catch(() => setState('error'));
    }
  };

  // Repli : si la lecture inline échoue, on renvoie vers la source (toujours jouable).
  if (state === 'error') {
    return (
      <div className="flex flex-col items-start gap-1.5">
        <a
          href={sound.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-teal/45 px-4 py-2 font-ui text-sm text-teal transition-colors hover:bg-teal/10 active:scale-95"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M11 5 6 9H2v6h4l5 4V5Z" strokeLinejoin="round" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
          </svg>
          Écouter sur {sound.source} ↗
        </a>
        <span className="font-mono text-[10px] text-sand/70">
          🎙️ {sound.recordist} · {sound.license}
        </span>
      </div>
    );
  }

  const label =
    state === 'playing'
      ? 'Pause'
      : state === 'loading'
        ? 'Chargement…'
        : 'Écouter le cri';

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={toggle}
        aria-label={`Écouter le cri de ${name}`}
        className="inline-flex items-center gap-2.5 rounded-full border border-teal/45 px-4 py-2 font-ui text-sm text-teal transition-colors hover:bg-teal/10 active:scale-95"
      >
        {state === 'playing' ? (
          <span className="flex items-end gap-0.5" aria-hidden>
            <span className="eq-bar" style={{ animationDelay: '0ms' }} />
            <span className="eq-bar" style={{ animationDelay: '150ms' }} />
            <span className="eq-bar" style={{ animationDelay: '300ms' }} />
          </span>
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {state === 'loading' ? (
              <path
                d="M12 3a9 9 0 1 0 9 9"
                strokeLinecap="round"
                className="animate-spin"
                style={{ transformOrigin: 'center' }}
              />
            ) : (
              <>
                <path d="M11 5 6 9H2v6h4l5 4V5Z" strokeLinejoin="round" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" strokeLinecap="round" />
              </>
            )}
          </svg>
        )}
        {label}
      </button>

      <a
        href={sound.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[10px] text-sand hover:text-teal"
      >
        🎙️ {sound.recordist} · {sound.license} · {sound.source}
      </a>

      <audio
        ref={audioRef}
        src={sound.url}
        preload="none"
        onEnded={() => setState('idle')}
        onPause={() => setState((s) => (s === 'playing' ? 'idle' : s))}
        onError={() => setState('error')}
      />
    </div>
  );
}
