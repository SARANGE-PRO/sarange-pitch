import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentPropsWithoutRef<'input'> & { wrapperClassName?: string };

/** Champ de recherche stylé (icône loupe + placeholder). */
export const SearchInput = forwardRef<HTMLInputElement, Props>(
  function SearchInput({ className, wrapperClassName, ...props }, ref) {
    return (
      <div className={cn('relative flex-1', wrapperClassName)}>
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sand"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          ref={ref}
          type="search"
          className={cn(
            'w-full rounded-full border border-line bg-night/60 py-2.5 pl-10 pr-4 font-ui text-sm text-ivory',
            'placeholder:text-sand/70 focus-visible:border-gold/60 focus-visible:outline-none',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
