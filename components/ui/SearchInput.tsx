import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentPropsWithoutRef<'input'> & {
  wrapperClassName?: string;
  onClear?: () => void;
};

/** Champ de recherche stylé (icône loupe + bouton effacer). */
export const SearchInput = forwardRef<HTMLInputElement, Props>(
  function SearchInput({ className, wrapperClassName, onClear, value, ...props }, ref) {
    const hasValue = typeof value === 'string' && value.length > 0;
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
          value={value}
          className={cn(
            'w-full rounded-full border border-line bg-night/60 py-2.5 pl-10 pr-10 font-ui text-sm text-ivory',
            'placeholder:text-sand/70 focus-visible:border-gold/60 focus-visible:outline-none',
            '[&::-webkit-search-cancel-button]:appearance-none',
            className,
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Effacer la recherche"
            className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-sand transition-colors hover:bg-white/10 hover:text-ivory"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
