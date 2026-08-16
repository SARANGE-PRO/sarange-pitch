/** Liens de navigation externes (Google Maps / Apple Maps / Waze). */
export function googleMapsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

export function appleMapsUrl(lat: number, lon: number): string {
  return `https://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`;
}

export function wazeUrl(lat: number, lon: number): string {
  return `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
}

export function isAppleDevice(): boolean {
  return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
}

export function openNavigation(lat: number, lon: number, app: 'google' | 'apple' | 'waze' = 'google'): void {
  const url =
    app === 'apple' ? appleMapsUrl(lat, lon) : app === 'waze' ? wazeUrl(lat, lon) : googleMapsUrl(lat, lon);
  window.open(url, '_blank', 'noopener');
}
