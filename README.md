# KoikaSamui 🐆🐍🐠

Bestiaire éditorial et interactif de la faune de **Koh Samui** et des îles du
Golfe de Thaïlande (Koh Phangan, Koh Tao, parc marin d'Ang Thong). ~80 espèces
classées par catégorie, dangerosité et lieu d'observation, avec fiches
détaillées, carte de l'archipel et images libres créditées.

Direction artistique **« Lanna Futur »** : un temple thaïlandais numérisé —
matières traditionnelles (or, laque, jade, teal récif) traitées comme une
interface holographique nocturne. Mode sombre par défaut.

---

## Stack

- **Next.js 14** (App Router) · TypeScript strict
- **Tailwind CSS** + design tokens dédiés (`styles/tokens.css`)
- **Framer Motion** (menu mobile, micro-interactions) + animations CSS
- **next/image** (optimisation, `remotePatterns` Wikimedia)
- **Leaflet** + react-leaflet (carte interactive, tuiles CARTO sans token)
- **next/font** (Fraunces, Chakra Petch, IBM Plex Mono)
- Données typées en TS/JSON — pas de base de données

---

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

Autres scripts :

```bash
npm run build      # build de production
npm run start      # sert le build
npm run lint       # ESLint (next/core-web-vitals)
npm run fetch-images        # importe les photos libres (Wikimedia)
npm run fetch-observations  # importe les observations réelles (iNaturalist)
npm run fetch-sounds        # importe les cris/chants (iNaturalist + xeno-canto)
```

Sur Vercel, le script `vercel-build` enchaîne automatiquement
`fetch-images`, `fetch-observations`, `fetch-sounds` puis `next build`
(non-bloquant : un import qui échoue n'interrompt pas le déploiement).

Variable d'environnement **optionnelle** : `XENOCANTO_KEY` (clé gratuite
[xeno-canto](https://xeno-canto.org)) pour de meilleurs chants d'oiseaux.
Sans elle, les sons proviennent d'iNaturalist — aucune configuration requise.

### Données & API (toutes gratuites, sans clé)

- **Wikimedia Commons** — photos libres créditées (build).
- **iNaturalist** (`api.inaturalist.org`) — observations réelles géolocalisées
  près de l'archipel, affichées sur la carte des fiches (build → `data/observations.json`).
- **Cris & chants** — bouton « Écouter le cri » sur les fiches, sons libres
  d'iNaturalist (+ xeno-canto optionnel), crédités (build → `data/sounds.json`).
- **Boussole de terrain** — Device Orientation + Géolocalisation (natif,
  gratuit) : pointe vers le lieu d'observation le plus proche et gère les
  espèces présentes à plusieurs endroits (repli boussole statique sans capteur).
- **Activité & heure locale** — section « Actives en ce moment » selon l'heure
  de Koh Samui (UTC+7), mise en avant de la faune nocturne la nuit.
- **PWA hors-ligne renforcée** — le service worker met aussi en cache les
  photos déjà vues (plafond LRU) pour consulter les fiches en rando.

---

## Photos — Wikimedia Commons (licences CC / domaine public)

Le site utilise de **vraies photos légalement réutilisables**. Un script
d'import récupère automatiquement un cliché libre et crédité par espèce depuis
l'API Wikimedia Commons / Wikipédia :

```bash
npm run fetch-images          # complète les espèces sans photo
npm run fetch-images -- --force   # re-récupère tout
```

Le script écrit `data/photos.json` (`{ [slug]: PhotoCredit[] }`) avec, pour
chaque cliché : **auteur, licence et URL source**, affichés sur la photo et sur
la page [`/a-propos`](./app/a-propos/page.tsx) (attribution obligatoire pour les
licences CC-BY / CC-BY-SA).

- Pour les taxons de niveau supérieur (familles, genres, « spp. »), une espèce
  **représentative** de l'archipel est utilisée et signalée comme
  « illustration » (`approximate`) — voir la table `OVERRIDES` dans
  [`scripts/fetch-images.ts`](./scripts/fetch-images.ts).
- Les espèces sans photo affichent une **plaque « spécimen »** dessinée
  (glyphe + treillis kranok), cohérente avec la charte.

> ⚠️ Le script nécessite un accès réseau à `en.wikipedia.org` et
> `commons.wikimedia.org`. Dans un environnement à egress restreint, lancez-le
> en local puis committez `data/photos.json`. Les images sont servies
> directement depuis `upload.wikimedia.org` (voir `next.config.js` →
> `images.remotePatterns`) : aucun téléchargement ni stockage local requis.

---

## Structure

```
app/
  layout.tsx            polices, header/footer, métadonnées globales
  page.tsx              accueil (hero constellation, catégories, signatures)
  especes/page.tsx      liste filtrable (recherche + filtres + URL query params)
  especes/[slug]/       fiche détail (galerie, jauge, mini-carte, similaires)
  carte/page.tsx        carte interactive de l'archipel
  a-propos/page.tsx     méthodologie, sources, crédits photo
  api/og/route.tsx      images Open Graph dynamiques par espèce
  sitemap.ts            sitemap SEO
components/  ui · species · layout · map · home
data/        species.ts · locations.ts · taxonomy.ts · photos.json
lib/         types.ts · filters.ts · species.ts · geo.ts · wikimedia.ts · cn.ts
styles/      tokens.css
public/      patterns/kranok.svg
scripts/     fetch-images.ts
```

Modèle de données : voir [`lib/types.ts`](./lib/types.ts)
(`Species`, `DangerLevel`, `Category`, `ObservationZone`, `PhotoCredit`).

---

## Déploiement Vercel

Aucune variable d'environnement n'est requise pour un premier déploiement.

**Via l'interface** : importez le dépôt sur [vercel.com/new](https://vercel.com/new).
Next.js est détecté automatiquement.

**Via la CLI** :

```bash
npm i -g vercel
vercel          # préversion
vercel --prod   # production
```

Variable optionnelle :

| Variable | Rôle | Défaut |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canonique (métadonnées, OG, sitemap) | `https://koikasamui.vercel.app` |

Après avoir configuré votre domaine, définissez `NEXT_PUBLIC_SITE_URL` dans les
réglages du projet Vercel pour des URLs Open Graph et un sitemap corrects.

---

## Accessibilité & performance

- Responsive mobile-first (testé jusqu'à 360px)
- Focus clavier visible, lien d'évitement, `aria-*` (nav, filtres, jauge, carte)
- Contrastes AA en mode sombre, `alt` descriptif sur chaque photo
- `prefers-reduced-motion` respecté (animations désactivées)
- Contenu essentiel rendu côté serveur (fiches lisibles sans JavaScript)
- `next/image`, lazy loading, `next/font` self-hosté

---

## Sources & licence

Corpus d'espèces d'après des guides et observations naturalistes du Golfe de
Thaïlande. Photos : Wikimedia Commons / iNaturalist / GBIF (licences CC /
domaine public), créditées individuellement.

Fiche à visée informative — gardez vos distances avec la faune sauvage.
