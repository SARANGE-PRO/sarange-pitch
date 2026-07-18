'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_LINKS, isActive } from './nav-links';
import { MascotWordmark } from '@/components/brand/MascotWordmark';
import { cn } from '@/lib/cn';

export function MobileNav({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Verrouille le défilement quand le menu est ouvert.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            aria-label="Fermer le menu"
            onClick={onClose}
            className="absolute inset-0 bg-night/90 backdrop-blur-sm"
          />
          <motion.nav
            style={{
              backgroundColor: '#0F2119',
              paddingTop: 'calc(1.5rem + env(safe-area-inset-top))',
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
            }}
            className="absolute right-0 top-0 flex h-full w-[84%] max-w-xs flex-col border-l border-gold/20 px-6 shadow-[-24px_0_70px_rgba(0,0,0,0.7)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8">
              <MascotWordmark imgClass="h-12" textClass="text-lg" />
            </div>

            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const activeLink = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    aria-current={activeLink ? 'page' : undefined}
                    className={cn(
                      'rounded-[var(--radius)] px-4 py-3.5 font-display text-2xl transition-colors',
                      activeLink
                        ? 'bg-gold/12 text-gold'
                        : 'text-ivory hover:bg-white/5 hover:text-gold',
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <p className="mt-auto font-mono text-[11px] leading-relaxed text-sand/70">
              Bestiaire de terrain — Golfe de Thaïlande.
            </p>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
