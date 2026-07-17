'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, isActive } from './nav-links';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/cn';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Ferme le menu à chaque navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line bg-night/80 backdrop-blur-md">
      <div className="container-editorial flex h-full items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="KoikaSamui — accueil"
        >
          <span
            className="h-3.5 w-3.5 rotate-45 rounded-[2px] bg-gold shadow-[0_0_12px_rgba(201,162,39,0.6)] transition-transform group-hover:rotate-[135deg]"
            aria-hidden
          />
          <span className="font-display text-lg font-semibold tracking-tight text-ivory">
            Koika<span className="text-gold">Samui</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const activeLink = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activeLink ? 'page' : undefined}
                className={cn(
                  'relative rounded-[var(--radius)] px-3.5 py-2 font-ui text-sm transition-colors',
                  activeLink ? 'text-gold' : 'text-sand hover:text-ivory',
                )}
              >
                {link.label}
                {activeLink && (
                  <span className="absolute inset-x-3.5 -bottom-px h-px bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-line text-ivory md:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-4">
            <span
              className={cn(
                'absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform',
                open && 'translate-y-[6px] rotate-45',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity',
                open && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-3 h-0.5 w-4 bg-current transition-transform',
                open && '-translate-y-[6px] -rotate-45',
              )}
            />
          </span>
        </button>
      </div>

      <MobileNav open={open} pathname={pathname} onClose={() => setOpen(false)} />
    </header>
  );
}
