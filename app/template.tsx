/**
 * Transition d'entrée à chaque navigation (re-monté par le routeur).
 * Animation CSS → fonctionne sans JS et ne masque jamais le contenu.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
