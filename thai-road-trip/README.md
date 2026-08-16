# Thai Road Trip 🛵🇹🇭

**Compagnon de voyage PWA offline-first** pour le road-trip Thaïlande du 30 août au 5 septembre 2026 :
Koh Samui → **Chiang Mai** → **Mae Kampong** → **Doi Inthanon** → Bangkok → vol international.

Installable sur iPhone/Android, utilisable **sans réseau dans les montagnes**, toutes les données restent
sur l'appareil (local-first, aucun compte, aucun backend).

## Fonctionnalités

- **Aujourd'hui** — jour du voyage calculé automatiquement en `Asia/Bangkok` : où on est, où on va,
  prochaine étape, progression, km et durée de route, nuit prévue, météo, alertes (grosse journée route,
  priorité Bangkok le 4-5).
- **Timeline** tactile par jour — statuts `À faire / En cours / Terminée / Ignorée / Reportée`
  (`planned / in_progress / completed / skipped / postponed`), heures prévues vs réelles, réordonnancement, édition complète.
- **Mode départ** — un seul écran avant chaque journée scooter/rando : destination, distance, durée,
  météo classée (🟢 favorable / 🟠 prudence / 🔴 défavorable — jamais « route sûre »), heure conseillée,
  coucher de soleil, checklist rapide (essence, casque, pneus, freins, powerbank, pluie…), bouton **DÉMARRER**
  qui enregistre l'heure réelle.
- **Mode road-trip** — interface minimale en route : destination, prochain arrêt, distance approx (GPS),
  boutons Google Maps / Apple Plans / Waze, pause, arrivée.
- **Mode randonnée** — fiches Monk's Trail et Pha Dok Siew (difficulté, longueur, checkpoints, équipement,
  guide Karen obligatoire), chrono départ/arrivée, durée réelle vs prévue.
- **Plan pluie 🌧** — analyse les activités météo-sensibles du jour, propose des alternatives à l'abri et le
  report en un clic vers le 4 septembre.
- **Journée joker (4 sept.)** — section **À rattraper** générée automatiquement depuis les activités
  reportées/ignorées des jours précédents, ajout au programme en un clic.
- **Carte interactive** (Leaflet + OpenStreetMap) — markers par catégorie, itinéraire du trip, filtres
  (Aujourd'hui, Temples, Randos, Cascades, Food, Hébergements, Transport, Favoris), bottom-sheet par lieu,
  position GPS, ajout rapide d'un lieu depuis la position courante.
- **Lieux** — fiches complètes avec **coordonnées GPS réelles** (Wat Phra Singh, Chedi Luang, Wat Umong,
  Wat Pha Lat, Doi Suthep, Mae Kampong, Wachirathan, sommet Doi Inthanon, pagodes royales, Mae Klang Luang,
  aéroports CNX/USM/BKK/DMK…), notes, photos locales compressées, favoris, partage Web Share.
- **Transports** — vols préchargés (horaires **à renseigner**, jamais inventés), compte à rebours pour les
  vols critiques, calcul automatique de l'heure de départ recommandée de l'hôtel (trajet + marge).
- **Hébergements** (6 nuits préchargées par ville), **réservations**, **fiche location scooter** avec photos
  d'état à la prise, **page urgence** (numéros à renseigner soi-même, bouton appel).
- **Budget THB** — dépenses par catégorie, ajout rapide ⛽ essence, total / aujourd'hui / moyenne par jour,
  répartition graphique.
- **Notes** avec recherche, catégories et favoris · **checklist** persistante 4 sections · **recherche globale**.
- **Sauvegarde** — export JSON complet + import validé · **réinitialisation** à double confirmation.
- **Dark mode** réellement conçu (clair / sombre / système), safe-areas iPhone, écrans avant/pendant/après voyage.

## Stack

React 18 · TypeScript strict · Vite 5 · Tailwind CSS · React Router · Dexie (IndexedDB) ·
Leaflet + OpenStreetMap · vite-plugin-pwa (Workbox) · date-fns(-tz) · Lucide Icons · Vitest · Playwright.

## Démarrer

```bash
npm install
npm run dev        # développement
npm run build      # build production (tsc + vite + service worker)
npm run preview    # sert le build en local
npm test           # tests unitaires (Vitest, 30 tests)
npm run e2e        # tests end-to-end (Playwright)
npm run icons      # régénère les icônes PWA (public/)
```

## Structure

```
src/
  app/            App, routes lazy, ErrorBoundary
  components/     UI (boutons, sheets, toasts…), layout, timeline, météo, plan pluie…
  pages/          Aujourd'hui, Parcours, Jour, Carte, Notes, Budget, Transports…
  data/           thailandTrip2026.ts (itinéraire réel) + places.ts (GPS centralisés)
  db/             Dexie : schéma versionné, seed unique, backup export/import
  services/       itinéraire, météo, navigation, partage, photos, notifications
  hooks/          settings, thème, online, GPS, toasts, horloge
  utils/          timezone Bangkok, distances, formats
tests/            Vitest (timezone, joker, statuts, DB, backup, budget, météo, checklist)
e2e/              Playwright (persistance, report au 4, dépense, export)
```

## PWA & offline

- Manifest complet (`Thai Road Trip` / `Thai Trip`), icônes + maskable + Apple touch, standalone, theme-color.
- Precache du shell applicatif, fallback SPA, cache runtime borné des tuiles OSM (usage individuel conforme
  à la tile policy — pas de téléchargement en masse) et des réponses météo.
- **Toutes les données** (itinéraire, lieux, GPS, statuts, notes, budget, checklist, réservations, photos)
  vivent dans IndexedDB : l'application est pleinement fonctionnelle sans réseau ; seul le fond de carte
  peut manquer, avec un message explicite — jamais de blocage.

## Données & configuration

- Le voyage est seedé **une seule fois** (`meta.seedVersion`) : les mises à jour de l'app n'écrasent jamais
  vos modifications.
- **Volontairement à renseigner par vous** (jamais inventé) : horaires/compagnies des 3 vols, noms d'hôtels,
  numéros d'urgence, infos loueur de scooter. Tout est éditable dans l'interface (`À renseigner`).
- Météo : Open-Meteo en automatique (gratuit, sans clé) ou saisie manuelle. `.env.example` documente les
  options facultatives.

## Déploiement

**Vercel** : importer le repo, définir le *Root Directory* sur `thai-road-trip` — `vercel.json` fournit le
rewrite SPA et les en-têtes service worker. **Netlify** : `netlify.toml` inclus (publish `dist`).
Les routes SPA fonctionnent après refresh sur les deux plateformes.

## Sauvegarde

Réglages → *Exporter le voyage* produit un JSON complet (itinéraire, statuts, notes, budget, checklist,
réservations, hébergements, transports, favoris). L'import valide le format avant de remplacer les données.
