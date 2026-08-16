import { X } from 'lucide-react';
import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
} from 'react';

// ————— Boutons (cibles tactiles ≥ 44px) —————

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-ink active:opacity-85',
  secondary: 'bg-surface-2 text-ink active:bg-line',
  ghost: 'bg-transparent text-primary active:bg-primary-soft',
  danger: 'bg-danger/10 text-danger active:bg-danger/20',
  accent: 'bg-accent text-white active:opacity-85 dark:text-[#1d1607]',
};

export function Button({
  variant = 'primary',
  className = '',
  full = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; full?: boolean }) {
  return (
    <button
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[15px] font-semibold transition-colors disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    />
  );
}

export function IconButton({
  label,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-2 transition-colors active:bg-surface-2 ${className}`}
      {...props}
    />
  );
}

// ————— Cartes —————

export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`rounded-xl2 bg-surface p-4 shadow-card ${onClick ? 'w-full text-left transition-transform active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}

// ————— Badges —————

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'primary' | 'accent' | 'ok' | 'warn' | 'danger';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-surface-2 text-ink-2',
    primary: 'bg-primary-soft text-primary',
    accent: 'bg-accent-soft text-accent',
    ok: 'bg-ok/10 text-ok',
    warn: 'bg-warn/10 text-warn',
    danger: 'bg-danger/10 text-danger',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

// ————— Bottom sheet mobile —————

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
      <div className="animate-fade-in absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="animate-sheet-up absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-surface shadow-sheet sm:mx-auto sm:max-w-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-5 pb-1 pt-3">
          <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-line" />
          <h2 className="mt-2 text-lg font-bold">{title}</h2>
          <IconButton label="Fermer" onClick={onClose} className="mt-1 -mr-2">
            <X size={20} />
          </IconButton>
        </div>
        <div className="px-5 pb-8 pb-safe">{children}</div>
      </div>
    </div>
  );
}

// ————— Confirmation (actions destructives uniquement) —————

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  danger = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-6" role="alertdialog" aria-modal="true">
      <div className="animate-fade-in absolute inset-0 bg-black/45" onClick={onCancel} />
      <div className="animate-fade-in relative w-full max-w-sm rounded-xl2 bg-surface p-5 shadow-sheet">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm text-ink-2">{message}</p>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" full onClick={onCancel}>
            Annuler
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} full onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ————— États vides —————

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-ink-3">
        {icon}
      </div>
      <p className="text-base font-semibold">{title}</p>
      {subtitle && <p className="mt-1 max-w-xs text-sm text-ink-3">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ————— Progression —————

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div
      className={`h-2 overflow-hidden rounded-full bg-surface-2 ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

// ————— Champs de formulaire —————

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-2">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
}

const INPUT_CLASSES =
  'w-full min-h-[44px] rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${INPUT_CLASSES} ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${INPUT_CLASSES} ${props.className ?? ''}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${INPUT_CLASSES} appearance-none ${props.className ?? ''}`} />;
}

// ————— Segmented control —————

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-xl bg-surface-2 p-1" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`min-h-[38px] flex-1 rounded-lg px-2 text-sm font-semibold transition-colors ${
            value === o.value ? 'bg-surface text-ink shadow-card' : 'text-ink-3'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ————— Skeleton —————

export function SkeletonCard() {
  return (
    <div className="rounded-xl2 bg-surface p-4 shadow-card">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton mt-3 h-3 w-1/2" />
      <div className="skeleton mt-2 h-3 w-1/3" />
    </div>
  );
}

// ————— Toggle —————

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-line'}`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? 'left-7' : 'left-1'}`}
      />
    </button>
  );
}

// ————— Hook util pour listes réordonnables (mobile: flèches, desktop: drag) —————

export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  return { open, onOpen: () => setOpen(true), onClose: () => setOpen(false), toggle: () => setOpen((v) => !v) };
}
