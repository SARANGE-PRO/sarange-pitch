/** Concatène des classes conditionnelles (utilitaire minimal type clsx). */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ');
}
