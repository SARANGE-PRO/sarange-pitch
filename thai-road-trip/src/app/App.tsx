import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { db } from '@/db';
import { seedIfNeeded } from '@/db/seed';
import { ToastProvider } from '@/hooks/useToast';
import { useTheme } from '@/hooks/useTheme';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorBoundary } from './ErrorBoundary';
import { SkeletonCard } from '@/components/ui';
import TodayPage from '@/pages/TodayPage';

const ItineraryPage = lazy(() => import('@/pages/ItineraryPage'));
const DayDetailPage = lazy(() => import('@/pages/DayDetailPage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const MorePage = lazy(() => import('@/pages/MorePage'));
const PlaceDetailPage = lazy(() => import('@/pages/PlaceDetailPage'));
const TransportsPage = lazy(() => import('@/pages/TransportsPage'));
const AccommodationsPage = lazy(() => import('@/pages/AccommodationsPage'));
const ReservationsPage = lazy(() => import('@/pages/ReservationsPage'));
const ChecklistPage = lazy(() => import('@/pages/ChecklistPage'));
const BudgetPage = lazy(() => import('@/pages/BudgetPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const EmergencyPage = lazy(() => import('@/pages/EmergencyPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ScooterPage = lazy(() => import('@/pages/ScooterPage'));
const DepartureModePage = lazy(() => import('@/pages/DepartureModePage'));
const RoadTripModePage = lazy(() => import('@/pages/RoadTripModePage'));
const HikePage = lazy(() => import('@/pages/HikePage'));

function ThemeGate({ children }: { children: React.ReactNode }) {
  useTheme();
  return <>{children}</>;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    seedIfNeeded(db)
      .then(() => setReady(true))
      .catch((err: unknown) => {
        // IndexedDB indisponible (navigation privée stricte…) : on informe
        // sans écran blanc.
        setDbError(err instanceof Error ? err.message : String(err));
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl space-y-3 p-4 pt-12">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <ThemeGate>
          {dbError && (
            <div className="bg-danger/10 p-3 text-center text-xs font-semibold text-danger">
              Stockage local indisponible : les modifications ne seront pas conservées. ({dbError})
            </div>
          )}
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="mx-auto max-w-3xl space-y-3 p-4 pt-12">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              }
            >
              <Routes>
                <Route element={<AppShell />}>
                  <Route index element={<TodayPage />} />
                  <Route path="/parcours" element={<ItineraryPage />} />
                  <Route path="/jour/:dayId" element={<DayDetailPage />} />
                  <Route path="/carte" element={<MapPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/plus" element={<MorePage />} />
                  <Route path="/lieu/:placeId" element={<PlaceDetailPage />} />
                  <Route path="/transports" element={<TransportsPage />} />
                  <Route path="/hebergements" element={<AccommodationsPage />} />
                  <Route path="/reservations" element={<ReservationsPage />} />
                  <Route path="/checklist" element={<ChecklistPage />} />
                  <Route path="/budget" element={<BudgetPage />} />
                  <Route path="/favoris" element={<FavoritesPage />} />
                  <Route path="/urgence" element={<EmergencyPage />} />
                  <Route path="/reglages" element={<SettingsPage />} />
                  <Route path="/recherche" element={<SearchPage />} />
                  <Route path="/scooter" element={<ScooterPage />} />
                  <Route path="/depart/:dayId" element={<DepartureModePage />} />
                  <Route path="/route/:legId" element={<RoadTripModePage />} />
                  <Route path="/rando/:activityId" element={<HikePage />} />
                  <Route path="*" element={<TodayPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeGate>
      </ToastProvider>
    </ErrorBoundary>
  );
}
