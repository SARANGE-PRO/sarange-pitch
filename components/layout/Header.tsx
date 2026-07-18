'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { NAV_LINKS, isActive } from './nav-links';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/cn';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Ferme le menu à chaque navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Header en verre « scroll-aware » : plus opaque une fois défilé.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'glass-bar pt-safe sticky top-0 z-50',
        scrolled && 'glass-bar-scrolled',
      )}
    >
      <div className="container-editorial flex h-[var(--header-h)] items-center justify-between">
        <Link
          href="/"
          className="group flex items-center"
          aria-label="KoïKoSamui — accueil"
        >
          <Image
            src="/brand/logo.png"
            alt="KoïKoSamui"
            width={800}
            height={416}
            priority
            unoptimized
            className="h-9 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-[1.04] sm:h-10"
          />
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
          className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-line bg-lacquer text-ivory md:hidden"
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
