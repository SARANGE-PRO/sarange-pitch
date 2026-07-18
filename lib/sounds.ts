import type { SoundClip } from '@/lib/types';
import soundsJson from '@/data/sounds.json';

/**
 * Cris / chants par espèce (data/sounds.json, généré par
 * scripts/fetch-sounds.ts). Vide tant que le script n'a pas tourné.
 */
const sounds = soundsJson as Record<string, SoundClip>;

export function getSound(slug: string): SoundClip | undefined {
  return sounds[slug];
}
