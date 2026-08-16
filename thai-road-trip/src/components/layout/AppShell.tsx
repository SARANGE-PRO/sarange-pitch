import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Sun, Route, Map, StickyNote, MoreHorizontal, WifiOff } from 'lucide-react';
import { useOnline } from '@/hooks/useOnline';
import { InstallPrompt } from './InstallPrompt';

const TABS = [
  { to: '/', label: "Aujourd'hui", icon: Sun, main: true },
  { to: '/parcours', label: 'Parcours', icon: Route, main: false },
  { to: '/carte', label: 'Carte', icon: Map, main: false },
  { to: '/notes', label: 'Notes', icon: StickyNote, main: false },
  { to: '/plus', label: 'Plus', icon: MoreHorizontal, main: false },
];

export function AppShell() {
  const online = useOnline();
  const location = useLocation();
  const isMapPage = location.pathname === '/carte';

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col">
      {!online && (
        <div
          className="pt-safe sticky top-0 z-50 bg-accent-soft text-accent"
          role="status"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-semibold">
            <WifiOff size={13} />
            Hors connexion — vos données restent disponibles
          </div>
        </div>
      )}
      <main className={`flex-1 ${isMapPage ? '' : 'px-4 pb-32 pt-4'} ${online ? 'pt-safe-content' : ''}`}>
        <Outlet />
      </main>
      <InstallPrompt />
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur-md"
        aria-label="Navigation principale"
      >
        <div className="pb-safe mx-auto max-w-3xl">
          <div className="flex items-stretch justify-around">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === '/'}
                  className={({ isActive }) =>
                    `flex min-h-[56px] min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 px-1 pt-1.5 pb-1 text-[11px] font-semibold transition-colors ${
                      isActive ? 'text-primary' : 'text-ink-3'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                          isActive && tab.main ? 'bg-primary text-primary-ink' : isActive ? 'bg-primary-soft' : ''
                        }`}
                      >
                        <Icon size={tab.main ? 22 : 20} />
                      </span>
                      {tab.label}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
