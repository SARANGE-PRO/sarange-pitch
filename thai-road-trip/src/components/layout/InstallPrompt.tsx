import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button, IconButton } from '@/components/ui';
import { useSettings, updateSettings } from '@/hooks/useSettings';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Invitation d'installation discrète, affichée après un délai d'utilisation. */
export function InstallPrompt() {
  const settings = useSettings();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (!deferred || settings.installPromptDismissedAt) return;
    const timer = setTimeout(() => setVisible(true), 45_000);
    return () => clearTimeout(timer);
  }, [deferred, settings.installPromptDismissedAt]);

  if (!visible || !deferred) return null;

  const dismiss = () => {
    setVisible(false);
    void updateSettings({ installPromptDismissedAt: new Date().toISOString() });
  };

  return (
    <div
      className="fixed inset-x-4 z-[55] mx-auto max-w-md rounded-xl2 bg-surface p-4 shadow-sheet"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 5.5rem)' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Download size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Ajouter Thai Road Trip à votre écran d'accueil</p>
          <p className="mt-0.5 text-xs text-ink-3">Accès instantané, même hors connexion.</p>
        </div>
        <IconButton label="Ignorer" onClick={dismiss} className="-mr-2 -mt-1 h-9 w-9">
          <X size={17} />
        </IconButton>
      </div>
      <Button
        full
        className="mt-3"
        onClick={async () => {
          await deferred.prompt();
          dismiss();
        }}
      >
        Installer
      </Button>
    </div>
  );
}
