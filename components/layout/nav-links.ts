export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/especes', label: 'Espèces' },
  { href: '/biomes', label: 'Biomes' },
  { href: '/carte', label: 'Carte' },
  { href: '/a-propos', label: 'À propos' },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
