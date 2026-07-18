'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Ambiance « carnet de terrain » de la fiche espèce :
 * vignette vert forêt (clair au centre, presque noir aux bords) + fine texture
 * topographique. Monté via un portail sur <body> pour rester réellement fixé au
 * viewport (le template applique un transform qui piégerait un position:fixed).
 */
export function FieldBackdrop() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 field-vignette" />
      <div className="absolute inset-0 field-topo" />
    </div>,
    document.body,
  );
}
