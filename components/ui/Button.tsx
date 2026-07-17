import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 font-ui font-medium tracking-wide rounded-[var(--radius)] transition-all duration-150 active:scale-[0.97] focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-gold text-night hover:bg-[#dcb43a] shadow-[0_8px_24px_-12px_rgba(201,162,39,0.6)]',
  outline:
    'border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold',
  ghost: 'text-sand hover:text-ivory hover:bg-white/5',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-5 py-2.5',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ComponentPropsWithoutRef<'button'> & { href?: undefined };
type ButtonAsLink = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'href'
  >;

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', className } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ('href' in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest} />
    );
  }
  const { variant: _v, size: _s, className: _c, href: _h, ...rest } =
    props as ButtonAsButton;
  return <button className={classes} {...rest} />;
}
