/** Notifications locales opt-in — aucune dépendance à un serveur push. */
export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function showLocalNotification(title: string, body: string): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    navigator.serviceWorker?.ready
      .then((reg) => reg.showNotification(title, { body, icon: '/icon-192.png', badge: '/icon-192.png' }))
      .catch(() => new Notification(title, { body, icon: '/icon-192.png' }));
  } catch {
    // notifications indisponibles : silencieux, l'app reste utilisable
  }
}
