import { useEffect, useState } from 'react';
import { useSettings } from './useSettings';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

/**
 * Position GPS (opt-in via réglages). L'application reste pleinement
 * utilisable si la permission est refusée ou indisponible.
 */
export function useGeoPosition(watch = false): { position: GeoPosition | null; error: string | null } {
  const settings = useSettings();
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!settings.gpsEnabled || !('geolocation' in navigator)) return;
    const onOk = (p: GeolocationPosition) => {
      setError(null);
      setPosition({
        latitude: p.coords.latitude,
        longitude: p.coords.longitude,
        accuracy: p.coords.accuracy,
        timestamp: p.timestamp,
      });
    };
    const onErr = (e: GeolocationPositionError) => setError(e.message);
    const options: PositionOptions = { enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 };
    if (watch) {
      const id = navigator.geolocation.watchPosition(onOk, onErr, options);
      return () => navigator.geolocation.clearWatch(id);
    }
    navigator.geolocation.getCurrentPosition(onOk, onErr, options);
  }, [settings.gpsEnabled, watch]);

  return { position, error };
}
