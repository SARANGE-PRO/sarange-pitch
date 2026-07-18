'use client';

import { useEffect } from 'react';

/**
 * Empêche l'app installée (mode standalone) de « piéger » l'utilisateur :
 * tout lien externe est ouvert dans le navigateur système plutôt que dans la
 * fenêtre de l'application (qui n'a ni barre d'adresse ni bouton retour).
 *
 * Ne s'active qu'en mode standalone ; en navigateur normal, aucun effet.
 */
export function ExternalLinkGuard() {
  useEffect(() => {
    const nav = navigator as unknown as { standalone?: boolean };
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      nav.standalone === true;
    if (!standalone) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      // Uniquement les liens http(s) vers une autre origine.
      if (
        (url.protocol === 'http:' || url.protocol === 'https:') &&
        url.origin !== window.location.origin &&
        anchor.target !== '_blank'
      ) {
        e.preventDefault();
        window.open(url.href, '_blank', 'noopener,noreferrer');
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
