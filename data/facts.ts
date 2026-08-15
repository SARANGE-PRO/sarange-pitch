import type { SpeciesFacts } from '@/lib/types';

/**
 * Fiche technique par espèce — taille, poids, longévité et régime
 * alimentaire, fusionnés au rendu via lib/species.ts (comme ACTIVITY).
 * Fourchettes typiques pour un adulte, issues de la littérature
 * naturaliste générale ; valeurs indicatives pour le grand public.
 */
export const FACTS: Record<string, SpeciesFacts> = {
  // -------------------------------------------------------------- Mammifères
  'macaque-longue-queue': {
    size: '38–55 cm, queue de 40–65 cm',
    weight: '3–9 kg (mâle plus lourd)',
    lifespan: '25–30 ans',
    diet: 'Omnivore : fruits, insectes, crabes, œufs',
  },
  'chauve-souris': {
    size: '3–15 cm ; envergure jusqu’à 1,5 m (roussettes)',
    weight: '5 g à 1 kg selon l’espèce',
    lifespan: '5–30 ans',
    diet: 'Insectes (micro-chiroptères) ou fruits et nectar (roussettes)',
  },
  'chien-chat-errant': {
    size: 'chien 40–60 cm au garrot · chat 23–25 cm',
    weight: 'chien 10–25 kg · chat 3–5 kg',
    lifespan: '8–14 ans',
    diet: 'Opportuniste : restes, déchets, petites proies',
  },
  'buffle-d-eau': {
    size: '2,4–3 m de long, 1,3–1,9 m au garrot',
    weight: '300–1 200 kg',
    lifespan: '20–25 ans',
    diet: 'Herbivore : herbes, plantes aquatiques',
  },
  'macaque-d-assam': {
    size: '50–73 cm, queue courte de 15–30 cm',
    weight: '5–12 kg',
    lifespan: '25–30 ans',
    diet: 'Omnivore : fruits, feuilles, invertébrés',
  },
  'langur-feuilles-sombres': {
    size: '42–61 cm, queue de 50–85 cm',
    weight: '5–9 kg',
    lifespan: '20–25 ans',
    diet: 'Folivore : feuilles, pousses, fruits',
  },
  'macaque-mangeur-crabes': {
    size: '38–55 cm, queue de 40–65 cm',
    weight: '3–9 kg',
    lifespan: '25–30 ans',
    diet: 'Crabes, coquillages, fruits, insectes',
  },
  'muntjac-indien': {
    size: '0,9–1,35 m de long, 50–72 cm au garrot',
    weight: '14–28 kg',
    lifespan: '15–17 ans',
    diet: 'Herbivore : feuilles, fruits tombés, pousses',
  },
  sanglier: {
    size: '0,9–1,8 m de long, 55–100 cm au garrot',
    weight: '50–100 kg (jusqu’à 200 kg)',
    lifespan: '10–14 ans',
    diet: 'Omnivore : racines, fruits, invertébrés, charognes',
  },
  'serow-indochinois': {
    size: '1,4–1,8 m de long, 85–95 cm au garrot',
    weight: '85–140 kg',
    lifespan: '10–15 ans',
    diet: 'Herbivore : feuilles, pousses, herbes',
  },
  'chat-de-temminck': {
    size: '66–105 cm, queue de 40–57 cm',
    weight: '9–16 kg',
    lifespan: '15–20 ans (en captivité)',
    diet: 'Carnivore : rongeurs, oiseaux, jeunes ongulés',
  },
  'chat-pecheur': {
    size: '57–78 cm, queue de 20–30 cm',
    weight: '5–16 kg (mâle bien plus lourd)',
    lifespan: '10–12 ans',
    diet: 'Poissons, crustacés, grenouilles, rongeurs',
  },
  'porc-epic-malais': {
    size: '56–74 cm, piquants jusqu’à 25 cm',
    weight: '7–10 kg',
    lifespan: 'jusqu’à 27 ans (en captivité)',
    diet: 'Racines, tubercules, écorces, fruits tombés',
  },
  'ours-d-asie': {
    size: '1,2–1,9 m de long',
    weight: '65–200 kg (mâle plus lourd)',
    lifespan: '25–30 ans',
    diet: 'Omnivore : fruits, insectes, miel, petits vertébrés',
  },
  'loris-lent-sonde': {
    size: '27–38 cm (queue vestigiale)',
    weight: '600–700 g',
    lifespan: '≈ 20 ans',
    diet: 'Gomme d’arbres, nectar, fruits, insectes',
  },

  // ---------------------------------------------------------------- Reptiles
  'gecko-tokay': {
    size: '25–35 cm (jusqu’à 40 cm)',
    weight: '150–300 g',
    lifespan: '≈ 10 ans (jusqu’à 20 en captivité)',
    diet: 'Insectes, autres geckos, petits vertébrés',
  },
  'varan-malais': {
    size: '1,5–2 m (jusqu’à 3 m)',
    weight: '20–30 kg (jusqu’à 50 kg)',
    lifespan: '15–20 ans',
    diet: 'Carnivore-charognard : poissons, crabes, oiseaux, carcasses',
  },
  'python-reticule': {
    size: '3–6 m (record ≈ 10 m)',
    weight: '30–75 kg (jusqu’à 160 kg)',
    lifespan: '20–25 ans',
    diet: 'Mammifères et oiseaux, tués par constriction',
  },
  'python-molure': {
    size: '3–5 m',
    weight: '30–90 kg',
    lifespan: '20–25 ans',
    diet: 'Mammifères, oiseaux, reptiles, tués par constriction',
  },
  'couleuvre-volante': {
    size: '1–1,3 m, corps fin',
    weight: '≈ 100–200 g',
    lifespan: '≈ 10 ans',
    diet: 'Lézards, geckos, grenouilles, chauves-souris',
  },
  'serpent-fouet': {
    size: '1,5–2 m, corps très fin',
    weight: '< 150 g',
    lifespan: '10–12 ans',
    diet: 'Lézards, grenouilles, petits oiseaux',
  },
  'elaphe-des-mangroves': {
    size: '1,6–2,4 m',
    weight: '0,5–1 kg',
    lifespan: '15–20 ans (en captivité)',
    diet: 'Rongeurs, oiseaux, chauves-souris',
  },
  'beauty-snake': {
    size: '1,8–2,5 m',
    weight: '1–2,5 kg',
    lifespan: '15–20 ans',
    diet: 'Rongeurs, oiseaux, œufs',
  },
  boiga: {
    size: '1,5–2,5 m selon l’espèce',
    weight: '0,5–1,5 kg',
    lifespan: '12–20 ans',
    diet: 'Oiseaux, œufs, lézards, petits mammifères',
  },
  'cobra-a-lunettes': {
    size: '1,2–1,5 m (jusqu’à 2,3 m)',
    weight: '1–3 kg',
    lifespan: '≈ 20 ans',
    diet: 'Rongeurs, amphibiens, autres serpents',
  },
  'vipere-de-russell': {
    size: '0,9–1,2 m (jusqu’à 1,66 m)',
    weight: '1–4 kg',
    lifespan: '10–15 ans',
    diet: 'Rongeurs principalement',
  },
  'vipere-des-bambous': {
    size: '60–80 cm (femelle plus grande)',
    weight: '100–300 g',
    lifespan: '10–15 ans',
    diet: 'Grenouilles, lézards, rongeurs, oiseaux',
  },
  'vipere-des-temples': {
    size: 'mâle 40–50 cm · femelle jusqu’à 1 m',
    weight: '150–500 g (femelle bien plus massive)',
    lifespan: '12–15 ans',
    diet: 'Rongeurs, oiseaux, lézards, chassés à l’affût',
  },
  'trimeresurus-wiroti': {
    size: '60–90 cm',
    weight: '100–300 g',
    lifespan: '10–15 ans',
    diet: 'Rongeurs, grenouilles, lézards',
  },

  // ----------------------------------------------------------------- Oiseaux
  'drongo-a-raquettes': {
    size: '30–35 cm, brins caudaux jusqu’à 30 cm de plus',
    weight: '70–125 g',
    lifespan: '≈ 15 ans',
    diet: 'Insectes capturés en vol, nectar',
  },
  'heron-garde-boeufs': {
    size: '46–56 cm ; envergure 88–96 cm',
    weight: '270–510 g',
    lifespan: '10–15 ans (record 23 ans)',
    diet: 'Insectes et petits vertébrés délogés par le bétail',
  },
  'martin-pecheur': {
    size: '16–28 cm selon l’espèce',
    weight: '25–90 g',
    lifespan: '6–10 ans',
    diet: 'Poissons, crustacés, gros insectes',
  },
  'pygargue-aigle-de-mer': {
    size: '66–90 cm ; envergure 1,8–2,2 m',
    weight: '1,8–3,9 kg (femelle plus grande)',
    lifespan: '≈ 30 ans',
    diet: 'Poissons, serpents de mer, charognes',
  },
  calao: {
    size: '55–90 cm selon l’espèce',
    weight: '0,5–1 kg (calao pie)',
    lifespan: '30–40 ans',
    diet: 'Fruits (figues surtout), gros insectes, petits vertébrés',
  },
  bulbul: {
    size: '18–21 cm',
    weight: '25–40 g',
    lifespan: '≈ 10 ans',
    diet: 'Fruits, baies, nectar, insectes',
  },
  loriot: {
    size: '24–28 cm',
    weight: '60–100 g',
    lifespan: '8–12 ans',
    diet: 'Fruits, insectes, nectar',
  },
  mynah: {
    size: '23–26 cm',
    weight: '80–145 g',
    lifespan: '≈ 12 ans (jusqu’à 25 en captivité)',
    diet: 'Omnivore : insectes, fruits, restes urbains',
  },
  perruche: {
    size: '30–38 cm, longue queue comprise',
    weight: '100–140 g',
    lifespan: '20–30 ans',
    diet: 'Graines, fruits, bourgeons, nectar',
  },
  'mouette-sterne': {
    size: '25–50 cm ; envergure 0,7–1,3 m',
    weight: '100–400 g',
    lifespan: '10–20 ans',
    diet: 'Petits poissons pêchés en piqué, invertébrés',
  },
  'milan-brahminy': {
    size: '45–51 cm ; envergure 1,1–1,25 m',
    weight: '320–670 g',
    lifespan: '≈ 20 ans',
    diet: 'Poissons, crabes, charognes, déchets de pêche',
  },
  'coq-de-combat': {
    size: '65–75 cm (coq)',
    weight: '2–4 kg',
    lifespan: '5–10 ans',
    diet: 'Graines, insectes, végétaux',
  },

  // -------------------------------------------------------------- Arthropodes
  'araignee-sauteuse': {
    size: '4–12 mm (jusqu’à 2 cm pour les Hyllus)',
    weight: '< 1 g',
    lifespan: '1–2 ans',
    diet: 'Insectes chassés à l’affût, sans toile',
  },
  nephile: {
    size: 'femelle 3–5 cm de corps (≈ 20 cm pattes comprises) · mâle < 1 cm',
    weight: '2–5 g (femelle)',
    lifespan: '≈ 1 an',
    diet: 'Insectes volants pris dans la toile',
  },
  'araignee-crabe-geante': {
    size: 'corps 3–4,5 cm ; jusqu’à 25 cm pattes déployées',
    weight: '≈ 5 g',
    lifespan: '≈ 2 ans',
    diet: 'Insectes, cafards, parfois petits geckos',
  },
  tarentule: {
    size: 'corps 6–9 cm ; 13–16 cm pattes déployées',
    weight: '15–30 g',
    lifespan: 'femelle 10–15 ans · mâle 3–4 ans',
    diet: 'Gros insectes, petits vertébrés',
  },
  'scorpion-noir-thailandais': {
    size: '10–13 cm (jusqu’à 16 cm)',
    weight: '20–50 g',
    lifespan: '7–8 ans',
    diet: 'Insectes, araignées, saisis aux pinces',
  },
  'scolopendre-geante': {
    size: '16–25 cm (jusqu’à 30 cm)',
    weight: '20–60 g',
    lifespan: '≈ 10 ans',
    diet: 'Insectes, araignées, petits vertébrés',
  },

  // ----------------------------------------------------------------- Insectes
  'fourmi-tisserande': {
    size: 'ouvrière 8–10 mm · reine 20–25 mm',
    weight: '≈ 5 mg',
    lifespan: 'ouvrière quelques mois · reine plusieurs années',
    diet: 'Insectes, miellat de pucerons',
  },
  'mante-religieuse': {
    size: '7–10 cm',
    weight: '3–5 g',
    lifespan: '≈ 1 an',
    diet: 'Insectes capturés vivants, parfois petits lézards',
  },
  moustique: {
    size: '3–6 mm',
    weight: '≈ 2,5 mg',
    lifespan: 'adulte 2–4 semaines',
    diet: 'Nectar ; sang uniquement chez la femelle (ponte)',
  },
  cafard: {
    size: '2–4 cm (blatte américaine)',
    weight: '≈ 1 g',
    lifespan: '1–2 ans',
    diet: 'Détritivore omnivore',
  },
  papillon: {
    size: 'envergure 3–16 cm selon l’espèce',
    weight: '< 1 g',
    lifespan: 'adulte 2 semaines à 1 mois',
    diet: 'Nectar ; feuilles pour les chenilles',
  },
  libellule: {
    size: 'corps 3–8 cm ; envergure jusqu’à 12 cm',
    weight: '< 1 g',
    lifespan: 'adulte 1–2 mois (larve aquatique jusqu’à 2 ans)',
    diet: 'Insectes capturés en plein vol (moustiques…)',
  },
  luciole: {
    size: '5–25 mm',
    weight: '< 0,5 g',
    lifespan: 'adulte 2–4 semaines',
    diet: 'Adulte : nectar ou rien · larve : escargots, limaces',
  },
  cigale: {
    size: '2–7 cm selon l’espèce',
    weight: '1–3 g',
    lifespan: 'adulte 4–6 semaines, après des années de vie larvaire',
    diet: 'Sève des arbres',
  },

  // ------------------------------------------------------------------ Marine
  'requin-baleine': {
    size: '8–12 m (jusqu’à 18 m)',
    weight: '15–20 t (jusqu’à 34 t)',
    lifespan: '80–130 ans',
    diet: 'Plancton et petits poissons filtrés',
  },
  'requin-gris-de-recif': {
    size: '1,5–1,9 m (jusqu’à 2,5 m)',
    weight: '20–35 kg',
    lifespan: '≈ 25 ans',
    diet: 'Poissons de récif, céphalopodes, crustacés',
  },
  'requin-leopard': {
    size: '1,5–2,5 m, longue queue comprise',
    weight: '20–30 kg',
    lifespan: '25–30 ans',
    diet: 'Mollusques, crustacés, petits poissons aspirés la nuit',
  },
  'requin-pointes-noires': {
    size: '1,1–1,6 m',
    weight: '10–24 kg',
    lifespan: '≈ 13 ans',
    diet: 'Petits poissons, seiches, crustacés',
  },
  'raie-pastenague-taches-bleues': {
    size: 'disque 30–35 cm ; ≈ 70 cm queue comprise',
    weight: '≈ 5 kg',
    lifespan: '15–20 ans',
    diet: 'Vers, crevettes, crabes, mollusques fouillés dans le sable',
  },
  'raie-manta': {
    size: 'envergure 3–4 m (jusqu’à 5 m)',
    weight: '0,7–1,4 t',
    lifespan: '≈ 40 ans',
    diet: 'Plancton filtré en boucles gracieuses',
  },
  'merou-geant': {
    size: '1,5–2 m (jusqu’à 2,7 m)',
    weight: 'jusqu’à 400 kg',
    lifespan: '≈ 50 ans',
    diet: 'Poissons, raies, crustacés, jeunes tortues',
  },
  'poisson-ange-six-bandes': {
    size: 'jusqu’à 46 cm',
    weight: '1,5–2 kg',
    lifespan: '≈ 20 ans',
    diet: 'Éponges, tuniciers, algues',
  },
  'poisson-papillon-8-bandes': {
    size: '10–12 cm',
    weight: '≈ 50 g',
    lifespan: '7–10 ans',
    diet: 'Polypes de coraux durs',
  },
  'labre-nettoyeur': {
    size: '10–14 cm',
    weight: '≈ 20 g',
    lifespan: '≈ 4 ans',
    diet: 'Parasites et peaux mortes des autres poissons',
  },
  'poisson-clown': {
    size: '8–11 cm',
    weight: '20–50 g',
    lifespan: '10–20 ans à l’abri de l’anémone',
    diet: 'Zooplancton, algues, restes de l’anémone',
  },
  'poisson-coffre': {
    size: 'jusqu’à 45 cm',
    weight: '≈ 1 kg',
    lifespan: '5–8 ans',
    diet: 'Invertébrés benthiques et algues soufflés du sable',
  },
  'poisson-ballon-etoile': {
    size: '0,6–1,2 m',
    weight: 'jusqu’à ≈ 10 kg',
    lifespan: '≈ 10 ans',
    diet: 'Coraux, oursins, crustacés, mollusques',
  },
  'baliste-a-moustache': {
    size: '50–75 cm',
    weight: 'jusqu’à 10 kg',
    lifespan: '10–15 ans',
    diet: 'Oursins, coraux, crustacés, mollusques',
  },
  diodon: {
    size: '40–70 cm (jusqu’à 90 cm)',
    weight: '2–3 kg (jusqu’à 6 kg)',
    lifespan: '10–15 ans',
    diet: 'Mollusques, oursins, crabes broyés la nuit',
  },
  barracuda: {
    size: '0,6–1,5 m (jusqu’à 2 m)',
    weight: '2–20 kg (record ≈ 45 kg)',
    lifespan: '≈ 14 ans',
    diet: 'Poissons attaqués en éclair',
  },
  'vivaneau-des-mangroves': {
    size: '40–80 cm (jusqu’à 1,2 m)',
    weight: '3–9 kg (jusqu’à 16 kg)',
    lifespan: 'jusqu’à 40 ans',
    diet: 'Poissons, crustacés, chassés de nuit',
  },
  hippocampe: {
    size: '15–30 cm selon l’espèce',
    weight: '5–20 g',
    lifespan: '1–5 ans',
    diet: 'Petits crustacés planctoniques aspirés',
  },
  nudibranche: {
    size: '1–10 cm (danseuse espagnole jusqu’à 40 cm)',
    weight: 'quelques grammes',
    lifespan: 'quelques semaines à 1 an',
    diet: 'Éponges, hydraires, anémones — toxines recyclées',
  },
  'poulpe-seiche-calmar': {
    size: '20 cm à 1 m, bras compris, selon l’espèce',
    weight: '0,2–6 kg selon l’espèce',
    lifespan: '1–3 ans',
    diet: 'Crabes, crevettes, poissons, mollusques',
  },
  'crevette-mantis': {
    size: '10–18 cm (jusqu’à 38 cm pour les fouisseuses)',
    weight: '60–200 g',
    lifespan: '4–6 ans (parfois bien plus)',
    diet: 'Crabes et mollusques brisés d’un coup de massue',
  },
  remora: {
    size: '40–80 cm (jusqu’à 1,1 m)',
    weight: '1–2 kg',
    lifespan: '≈ 10 ans',
    diet: 'Restes des repas de son hôte, parasites, petits poissons',
  },
  'tortue-verte': {
    size: 'carapace 0,9–1,2 m',
    weight: '110–190 kg (jusqu’à 300 kg)',
    lifespan: '60–80 ans',
    diet: 'Adulte herbivore : herbiers marins, algues',
  },
  'tortue-imbriquee': {
    size: 'carapace 60–90 cm',
    weight: '45–80 kg',
    lifespan: '30–50 ans',
    diet: 'Éponges surtout, méduses, anémones',
  },
};
