'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_LINKS, isActive } from './nav-links';
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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            aria-label="Fermer le menu"
            onClick={onClose}
            className="absolute inset-0 bg-night/80 backdrop-blur-sm"
          />
          <motion.nav
            className="kranok absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col gap-1 border-l border-line bg-lacquer p-6 pt-24"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV_LINKS.map((link) => {
              const activeLink = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'rounded-[var(--radius)] px-4 py-3 font-display text-2xl transition-colors',
                    activeLink
                      ? 'text-gold'
                      : 'text-ivory hover:bg-white/5 hover:text-gold',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
