export async function shareContent(data: { title: string; text: string; url?: string }): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share(data);
      return true;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${data.title}\n${data.text}${data.url ? `\n${data.url}` : ''}`);
      return true;
    }
  } catch {
    // partage annulé par l'utilisateur ou non supporté
  }
  return false;
}

export function sharePlaceText(name: string, lat?: number, lon?: number): { title: string; text: string; url?: string } {
  return {
    title: name,
    text: lat !== undefined && lon !== undefined ? `${name} — ${lat.toFixed(5)}, ${lon.toFixed(5)}` : name,
    url: lat !== undefined && lon !== undefined ? `https://www.google.com/maps?q=${lat},${lon}` : undefined,
  };
}
