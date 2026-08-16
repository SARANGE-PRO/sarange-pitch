import type { Species } from '@/lib/types';

/**
 * Données de base des espèces (hors photos).
 * Les photos — URLs Wikimedia Commons + crédits — sont fusionnées au moment
 * du rendu depuis data/photos.json via lib/species.ts (voir getAllSpecies()).
 *
 * Source du corpus : prototype « Bestiaire de Koh Samui », enrichi
 * (descriptions longues, slugs, zones normalisées).
 */
export type SpeciesBase = Omit<Species, 'photos' | 'activity' | 'facts'>;

export const speciesBase: SpeciesBase[] = [
  // ---------------------------------------------------------------- MAMMIFÈRES
  {
    slug: 'macaque-longue-queue',
    commonName: 'Macaque à longue queue',
    latinName: 'Macaca fascicularis',
    category: 'mammifere',
    danger: 1,
    zones: ['terre'],
    icon: '🐒',
    shortNote:
      "Le singe le plus commun de l'île, malin et parfois voleur de nourriture.",
    longDescription:
      "Omniprésent des lisières de forêt aux abords des temples, le macaque à longue queue vit en troupes hiérarchisées qui apprennent vite à profiter des humains. Son intelligence opportuniste en fait un pickpocket redoutable : sacs, téléphones et nourriture disparaissent en un éclair. Il ne faut jamais le nourrir — cela alimente l'agressivité et les morsures, principale cause de contact à risque sur l'archipel.",
    observationSpots: [
      { name: "Parc marin d'Ang Thong — Wua Talap", lat: 9.606, lng: 99.664 },
    ],
  },
  {
    slug: 'chauve-souris',
    commonName: 'Chauve-souris',
    latinName: 'Chiroptera spp.',
    category: 'mammifere',
    danger: 0,
    zones: ['air'],
    icon: '🦇',
    shortNote:
      'Visible au crépuscule, chassant les moustiques au-dessus des cocotiers.',
    longDescription:
      "Au coucher du soleil, des nuées de micro-chauves-souris insectivores et de grandes roussettes frugivores sortent des grottes calcaires d'Ang Thong et des cocoteraies. Elles rendent un service écologique majeur : régulation des moustiques et pollinisation des arbres tropicaux. Discrètes et sans danger, elles restent l'un des plus beaux spectacles nocturnes du Golfe.",
  },
  {
    slug: 'chien-chat-errant',
    commonName: 'Chien / chat errant',
    latinName: 'Canis familiaris / Felis catus',
    category: 'mammifere',
    danger: 1,
    zones: ['terre', 'urbain'],
    icon: '🐕',
    shortNote:
      'Présents partout sur l’île ; éviter le contact direct par précaution sanitaire.',
    longDescription:
      "Chiens et chats libres font partie du paysage de chaque village et plage de Koh Samui. La plupart sont dociles, mais la rage restant présente en Thaïlande, on évite tout contact direct avec un animal inconnu. Des associations locales de stérilisation et de vaccination œuvrent à réduire les populations errantes.",
  },
  {
    slug: 'buffle-d-eau',
    commonName: "Buffle d'eau",
    latinName: 'Bubalus bubalis',
    category: 'mammifere',
    danger: 0,
    zones: ['terre'],
    icon: '🐃',
    shortNote:
      "Élevé dans les fermes, souvent accompagné d'un héron nettoyeur de parasites.",
    longDescription:
      "Pilier de l'agriculture traditionnelle, le buffle d'eau se prélasse dans les mares et rizières de l'intérieur de l'île. Placide, il vit souvent en compagnie du héron garde-bœufs qui le débarrasse de ses parasites — un exemple classique de mutualisme. Les combats de buffles font partie du patrimoine culturel de Samui.",
  },
  {
    slug: 'macaque-d-assam',
    commonName: "Macaque d'Assam",
    latinName: 'Macaca assamensis',
    category: 'mammifere',
    danger: 1,
    zones: ['terre'],
    icon: '🐒',
    shortNote:
      "Observé notamment dans l'archipel du parc marin d'Ang Thong.",
    longDescription:
      "Plus trapu et au pelage plus terne que son cousin à longue queue, le macaque d'Assam préfère les reliefs karstiques et les forêts moins perturbées d'Ang Thong. Il se nourrit de fruits, de feuilles et d'invertébrés. Moins habitué à l'humain, il reste farouche mais peut se montrer défensif si on l'approche de trop près.",
    observationSpots: [
      { name: "Parc marin d'Ang Thong", lat: 9.617, lng: 99.655 },
    ],
  },
  {
    slug: 'langur-feuilles-sombres',
    commonName: 'Langur à feuilles sombres',
    latinName: 'Trachypithecus obscurus',
    category: 'mammifere',
    danger: 0,
    zones: ['terre'],
    icon: '🐒',
    shortNote:
      "Primate discret des forêts d'Ang Thong, au pelage sombre caractéristique.",
    longDescription:
      "Élégant primate folivore aux lunettes claires cerclant les yeux, le langur à feuilles sombres se déplace en petits groupes dans la canopée. Ses petits naissent d'un orange vif spectaculaire avant de prendre la teinte grise des adultes. Végétarien et timide, il fuit la présence humaine et se repère surtout à ses bonds entre les cimes.",
  },
  {
    slug: 'macaque-mangeur-crabes',
    commonName: 'Macaque mangeur de crabes',
    latinName: 'Macaca fascicularis (pop. littorale)',
    category: 'mammifere',
    danger: 1,
    zones: ['terre'],
    icon: '🦀',
    shortNote:
      "Population côtière se nourrissant de crabes et coquillages sur l'estran.",
    longDescription:
      "Certaines populations côtières de macaques à longue queue ont développé une culture de pêche : à marée basse, ils fouillent l'estran et utilisent parfois des pierres pour ouvrir coquillages et crabes. Cette transmission d'un savoir-faire de génération en génération fascine les primatologues. On les observe le long des mangroves et des plages rocheuses.",
  },
  {
    slug: 'muntjac-indien',
    commonName: 'Muntjac indien',
    latinName: 'Muntiacus muntjak',
    category: 'mammifere',
    danger: 0,
    zones: ['terre'],
    icon: '🦌',
    shortNote:
      "Petit cerf aboyeur, discret, vit dans les sous-bois des îles du parc d'Ang Thong.",
    longDescription:
      "Surnommé « cerf aboyeur » pour son cri d'alarme évoquant un chien, le muntjac est un petit cervidé solitaire des sous-bois denses. Les mâles portent de courts bois et de longues canines saillantes utilisées lors des rivalités. Nocturne et méfiant, il se trahit surtout par ses aboiements dans la pénombre.",
  },
  {
    slug: 'sanglier',
    commonName: 'Sanglier',
    latinName: 'Sus scrofa',
    category: 'mammifere',
    danger: 1,
    zones: ['terre'],
    icon: '🐗',
    shortNote:
      'Peut se montrer agressif si surpris ou acculé, à observer à distance.',
    longDescription:
      "Fouisseur robuste des forêts humides, le sanglier joue un rôle clé en retournant le sol et en dispersant les graines. Généralement méfiant, il peut charger s'il est surpris, acculé, ou si une laie protège ses marcassins. On garde toujours ses distances, surtout à l'aube et au crépuscule quand il est le plus actif.",
  },
  {
    slug: 'serow-indochinois',
    commonName: 'Serow indochinois',
    latinName: 'Capricornis milneedwardsii',
    category: 'mammifere',
    danger: 0,
    zones: ['terre'],
    icon: '🐐',
    shortNote:
      'Chèvre-antilope des zones rocheuses, rare et farouche.',
    longDescription:
      "Mi-chèvre mi-antilope, le serow est un grimpeur hors pair des escarpements calcaires, capable de gravir des pentes vertigineuses. Solitaire et extrêmement farouche, il ne se laisse qu'exceptionnellement apercevoir. Sa présence témoigne de la bonne santé des reliefs sauvages de la région.",
  },
  {
    slug: 'chat-de-temminck',
    commonName: 'Chat de Temminck',
    latinName: 'Catopuma temminckii',
    category: 'mammifere',
    danger: 0,
    zones: ['terre'],
    icon: '🐈',
    shortNote:
      'Petit félin sauvage rarement aperçu, présent dans les réserves régionales.',
    longDescription:
      "Félin de taille moyenne au pelage fauve uni, le chat de Temminck (ou chat doré d'Asie) est un chasseur crépusculaire discret des forêts. Farouche et territorial, il figure parmi les mammifères les plus rarement observés de la région. Ses populations, menacées par la perte d'habitat, en font une espèce précieuse pour la conservation.",
  },
  {
    slug: 'chat-pecheur',
    commonName: 'Chat pêcheur',
    latinName: 'Prionailurus viverrinus',
    category: 'mammifere',
    danger: 0,
    zones: ['terre'],
    icon: '🐈',
    shortNote:
      'Félin des zones humides et mangroves, excellent nageur, se nourrit de poissons.',
    longDescription:
      "Adapté à la vie aquatique, le chat pêcheur possède des pattes légèrement palmées et n'hésite pas à plonger pour attraper poissons, grenouilles et crustacés. Il hante les mangroves et zones humides côtières, milieux aujourd'hui fragilisés. Nocturne et solitaire, c'est l'un des rares félins véritablement amphibies.",
  },
  {
    slug: 'porc-epic-malais',
    commonName: 'Porc-épic malais',
    latinName: 'Hystrix brachyura',
    category: 'mammifere',
    danger: 1,
    zones: ['terre'],
    icon: '🦔',
    shortNote:
      'Ses longs piquants peuvent blesser en cas de contact rapproché.',
    longDescription:
      "Le plus grand rongeur de la région se défend avec des piquants pouvant dépasser trente centimètres, qu'il dresse et fait claquer pour intimider. Contrairement à une idée reçue, il ne « lance » pas ses piquants, mais recule brusquement sur un agresseur — une blessure profonde et douloureuse. Nocturne, il creuse des terriers et se nourrit de racines, fruits tombés et écorces.",
  },
  {
    slug: 'ours-d-asie',
    commonName: "Ours d'Asie (ours noir)",
    latinName: 'Ursus thibetanus',
    category: 'mammifere',
    danger: 2,
    zones: ['terre'],
    icon: '🐻',
    shortNote:
      'Rare et discret ; rencontre exceptionnelle dans les réserves forestières.',
    longDescription:
      "Reconnaissable au croissant clair sur son poitrail, l'ours noir d'Asie est puissant et potentiellement dangereux s'il est surpris ou s'il défend ses petits. Sa présence sur les îles est exceptionnelle et relève surtout des grandes réserves continentales. Menacé par le braconnage, il fait l'objet de programmes de protection stricts.",
  },
  {
    slug: 'loris-lent-sonde',
    commonName: 'Loris lent de la Sonde',
    latinName: 'Nycticebus coucang',
    category: 'mammifere',
    danger: 1,
    zones: ['terre'],
    icon: '🌙',
    shortNote:
      'Seul primate venimeux au monde ; sa morsure peut provoquer une réaction allergique.',
    longDescription:
      "Aux immenses yeux ronds adaptés à la nuit, le loris lent est le seul primate venimeux connu : il sécrète une toxine sous les coudes qu'il porte à sa bouche, rendant sa morsure allergisante voire dangereuse. Ses mouvements sont d'une lenteur hypnotique. Victime du trafic d'animaux de compagnie, il est aujourd'hui strictement protégé — l'observer dans la nature est un privilège rare.",
  },

  // ------------------------------------------------------------------ REPTILES
  {
    slug: 'gecko-tokay',
    commonName: 'Gecko tokay',
    latinName: 'Gekko gecko',
    category: 'reptile',
    danger: 0,
    zones: ['terre', 'urbain'],
    icon: '🦎',
    shortNote:
      "Reconnaissable à son cri puissant ; utile car il chasse moustiques et cafards.",
    longDescription:
      "Impossible à confondre : gris-bleu piqueté d'orange, le tokay lance un « to-kèh » sonore qui résonne dans les maisons et les temples. Bien qu'il puisse mordre fermement s'il est saisi, c'est un allié précieux qui dévore moustiques, cafards et araignées. Dans la tradition thaïe, l'entendre chanter un nombre pair de fois porte chance.",
  },
  {
    slug: 'varan-malais',
    commonName: 'Varan malais',
    latinName: 'Varanus salvator',
    category: 'reptile',
    danger: 0,
    zones: ['terre'],
    icon: '🦎',
    shortNote:
      "Impressionnant par sa taille mais inoffensif s'il n'est pas menacé.",
    longDescription:
      "Deuxième plus grand lézard du monde, le varan malais peut dépasser deux mètres et nage aussi bien qu'il grimpe. Charognard et prédateur opportuniste, il rend service en nettoyant les milieux, y compris les canaux urbains. Impressionnant mais placide, il fuit l'humain — il ne devient défensif que s'il est acculé, fouettant alors de sa queue.",
  },
  {
    slug: 'python-reticule',
    commonName: 'Python réticulé',
    latinName: 'Malayopython reticulatus',
    category: 'reptile',
    danger: 1,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      "Le plus long serpent du monde (jusqu'à 10 m) ; non venimeux mais impressionnant.",
    longDescription:
      "Champion de longueur du monde des serpents, le python réticulé arbore un motif géométrique irisé d'une beauté saisissante. Non venimeux, il tue par constriction et se nourrit surtout de rongeurs et de petits mammifères, régulant les nuisibles autour des villages. Les grands individus imposent le respect et se manipulent uniquement par des spécialistes.",
  },
  {
    slug: 'python-molure',
    commonName: 'Python molure',
    latinName: 'Python molurus',
    category: 'reptile',
    danger: 1,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      'Peut atteindre 6 mètres ; constricteur non venimeux, aime les zones humides.',
    longDescription:
      "Massif et au motif de taches brunes bordées de clair, le python molure fréquente les abords des points d'eau et des rizières. Constricteur patient, il chasse à l'affût mammifères et oiseaux. Longtemps chassé pour sa peau, il bénéficie aujourd'hui d'une protection et reste un maillon important du contrôle des rongeurs.",
  },
  {
    slug: 'couleuvre-volante',
    commonName: 'Couleuvre volante',
    latinName: 'Chrysopelea ornata',
    category: 'reptile',
    danger: 0,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      "Capable de s'aplatir et de planer entre les arbres ; jaune et vert vif.",
    longDescription:
      "Serpent des arbres au corps vert vif rehaussé de motifs noirs et or, la couleuvre volante réalise un exploit unique : en aplatissant ses côtes, elle plane d'un arbre à l'autre sur plusieurs mètres en ondulant dans les airs. Légèrement venimeuse mais totalement inoffensive pour l'homme, elle chasse geckos et lézards dans la canopée.",
  },
  {
    slug: 'serpent-fouet',
    commonName: 'Serpent fouet',
    latinName: 'Ahaetulla spp.',
    category: 'reptile',
    danger: 0,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      'Très fin et arboricole, vision stéréoscopique exceptionnelle pour un serpent.',
    longDescription:
      "D'une finesse de liane et d'un vert éclatant, le serpent fouet possède des pupilles horizontales en trou de serrure qui lui offrent une vision binoculaire remarquable pour juger les distances. Diurne et arboricole, il chasse lézards et grenouilles avec une lenteur féline. Sa morsure, à l'arrière de la mâchoire, est sans conséquence pour l'humain.",
  },
  {
    slug: 'elaphe-des-mangroves',
    commonName: 'Elaphe des mangroves',
    latinName: 'Gonyosoma spp.',
    category: 'reptile',
    danger: 0,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      'Serpent diurne et arboricole des zones de mangrove, atteint 2 mètres.',
    longDescription:
      "Longue couleuvre d'un vert profond à la langue bleu-noir, l'élaphe des mangroves patrouille les palétuviers et forêts humides à la recherche d'oiseaux et de rongeurs. Diurne et vive, elle gonfle son cou et vibre de la queue pour impressionner. Non venimeuse, elle joue un rôle utile dans l'équilibre des mangroves.",
  },
  {
    slug: 'beauty-snake',
    commonName: 'Beauty snake',
    latinName: 'Orthriophis taeniurus',
    category: 'reptile',
    danger: 0,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      'Grande couleuvre pouvant dépasser 2,5 mètres, non venimeuse.',
    longDescription:
      "Élégante couleuvre au corps fauve traversé d'une bande sombre en arrière du corps, la « beauty snake » fréquente aussi bien les forêts que les greniers et les grottes où elle chasse les rongeurs et les chauves-souris. Longue et agile, non venimeuse, elle est souvent tolérée près des habitations pour son rôle de régulateur naturel.",
  },
  {
    slug: 'boiga',
    commonName: 'Boiga',
    latinName: 'Boiga spp.',
    category: 'reptile',
    danger: 1,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      'Serpent nocturne légèrement venimeux, chasse petits mammifères et oiseaux.',
    longDescription:
      "Aux grands yeux à pupille verticale et au corps comprimé, les boigas — ou serpents-chats — sont des chasseurs nocturnes arboricoles. Leur venin, injecté par des crochets arrière, immobilise leurs proies mais reste bénin pour l'homme, provoquant tout au plus un œdème local. Ils s'aventurent parfois dans les jardins à la recherche de geckos et d'oisillons.",
  },
  {
    slug: 'cobra-a-lunettes',
    commonName: 'Cobra à lunettes',
    latinName: 'Naja kaouthia',
    category: 'reptile',
    danger: 2,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      'Se dresse et déploie sa coiffe si menacé ; venin neurotoxique dangereux.',
    longDescription:
      "Emblème redouté et respecté, le cobra à lunettes se dresse et déploie sa coiffe ornée d'un ocelle lorsqu'il se sent menacé. Son venin neurotoxique peut être mortel sans soin rapide : toute morsure impose une évacuation médicale immédiate. Il préfère fuir et n'attaque qu'en dernier recours — la plupart des accidents surviennent quand on tente de le tuer ou de le déplacer.",
  },
  {
    slug: 'vipere-de-russell',
    commonName: 'Vipère de Russell',
    latinName: 'Daboia russelii',
    category: 'reptile',
    danger: 2,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      "Un des serpents les plus dangereux d'Asie, mœurs nocturnes, venin hémotoxique.",
    longDescription:
      "Trapue et ornée de grandes taches brunes cerclées de clair, la vipère de Russell compte parmi les serpents les plus meurtriers d'Asie. Son venin hémotoxique provoque hémorragies, nécroses et défaillances rénales. Souvent présente près des cultures où abondent les rongeurs, elle siffle bruyamment avant de frapper — un avertissement à ne jamais ignorer.",
  },
  {
    slug: 'vipere-des-bambous',
    commonName: 'Vipère des bambous',
    latinName: 'Trimeresurus albolabris',
    category: 'reptile',
    danger: 2,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      'Petite vipère verte arboricole, très commune, morsure douloureuse.',
    longDescription:
      "Vert vif avec une queue rousse, cette petite vipère à fossettes thermosensibles se fond parfaitement dans le feuillage, ce qui la rend responsable de nombreuses morsures. Nocturne et arboricole, elle chasse grenouilles et lézards à l'affût. Son venin hémotoxique est rarement mortel mais provoque douleur intense et gonflement — une consultation médicale s'impose toujours.",
  },
  {
    slug: 'vipere-des-temples',
    commonName: 'Vipère des temples',
    latinName: 'Trimeresurus wagleri',
    category: 'reptile',
    danger: 2,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      'Vénérée dans certains temples bouddhistes, reste discrète mais venimeuse.',
    longDescription:
      "Sombre et striée de bandes jaunes et vertes, la vipère de Wagler est célèbre pour peupler certains temples-serpents de la région, où elle est vénérée et laissée en paix. Nocturne et étonnamment placide le jour, elle reste des heures immobile sur une branche. Son venin justifie néanmoins une prudence absolue : on ne la touche jamais.",
  },
  {
    slug: 'trimeresurus-wiroti',
    commonName: 'Trimeresurus wiroti',
    latinName: 'Trimeresurus wiroti',
    category: 'reptile',
    danger: 2,
    zones: ['terre'],
    icon: '🐍',
    shortNote:
      "Vipère nocturne des cours d'eau du sud de la Thaïlande, chasse dans les arbres.",
    longDescription:
      "Vipère à fossettes endémique du sud de la Thaïlande, T. wiroti fréquente la végétation bordant les ruisseaux forestiers. Nocturne et arboricole, elle guette ses proies suspendue aux branches basses. Peu documentée, elle illustre la richesse encore méconnue de l'herpétofaune régionale — et impose la même prudence que ses cousines venimeuses.",
  },

  // ------------------------------------------------------------------- OISEAUX
  {
    slug: 'drongo-a-raquettes',
    commonName: 'Drongo à raquettes',
    latinName: 'Dicrurus paradiseus',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🪶',
    shortNote:
      'Reconnaissable à sa longue queue fourchue en forme de raquettes.',
    longDescription:
      "Noir lustré aux reflets métalliques, le drongo à raquettes se reconnaît à ses deux longues plumes caudales terminées en palettes qui flottent en vol. Virtuose de l'imitation, il copie le chant d'autres oiseaux — parfois pour lancer de fausses alertes et voler leur nourriture. Audacieux, il n'hésite pas à harceler des rapaces bien plus grands que lui.",
  },
  {
    slug: 'heron-garde-boeufs',
    commonName: 'Héron garde-bœufs',
    latinName: 'Bubulcus ibis',
    category: 'oiseau',
    danger: 0,
    zones: ['air', 'terre'],
    icon: '🐦',
    shortNote:
      'Suit les buffles pour se nourrir des insectes qu’ils dérangent.',
    longDescription:
      "Petit héron blanc au bec jaune, il accompagne fidèlement buffles et bétail, happant les insectes que leurs pas font lever. En période nuptiale, ses plumes se parent de touches orangées. Grégaire, il forme au crépuscule de spectaculaires dortoirs bruyants dans les arbres au bord de l'eau.",
  },
  {
    slug: 'martin-pecheur',
    commonName: 'Martin-pêcheur',
    latinName: 'Alcedinidae',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🐦',
    shortNote:
      'Vol rapide et couleurs vives au-dessus des points d’eau et des côtes.',
    longDescription:
      "Éclair turquoise et roux au-dessus de l'eau, le martin-pêcheur guette depuis un perchoir avant de plonger tête la première pour saisir un poisson. La région abrite plusieurs espèces, du minuscule martin-pêcheur aux grands martins-chasseurs des mangroves. Leur présence signale des eaux poissonneuses et préservées.",
  },
  {
    slug: 'pygargue-aigle-de-mer',
    commonName: 'Pygargue / aigle de mer',
    latinName: 'Haliaeetus spp.',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🦅',
    shortNote:
      'Rapace côtier, plane au-dessus des criques à la recherche de poissons.',
    longDescription:
      "Grand rapace des littoraux, le pygargue plane en larges cercles au-dessus des baies avant de fondre serres en avant sur un poisson affleurant. Le pygargue blagre, à la tête et au poitrail blancs, niche sur les falaises isolées d'Ang Thong. Son cri nasillard et sa silhouette puissante en font un roi des côtes du Golfe.",
  },
  {
    slug: 'calao',
    commonName: 'Calao',
    latinName: 'Bucerotidae',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🦤',
    shortNote:
      'Grand bec caractéristique, visible en lisière de forêt.',
    longDescription:
      "Silhouette préhistorique surmontée d'un casque coloré, le calao vole à grand bruit d'ailes en lisière de forêt mûre. Son mode de nidification est unique : la femelle s'emmure dans une cavité d'arbre, nourrie par le mâle à travers une fente, le temps d'élever les jeunes. Grand disséminateur de graines, il est un indicateur de forêts encore intactes.",
  },
  {
    slug: 'bulbul',
    commonName: 'Bulbul',
    latinName: 'Pycnonotidae',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🐦',
    shortNote:
      "Chant mélodieux, l'un des oiseaux les plus fréquents de l'île.",
    longDescription:
      "Vif et bavard, le bulbul égaie jardins et lisières de son chant flûté du lever au coucher du soleil. Plusieurs espèces cohabitent, souvent huppées ou marquées de touches jaunes sous la queue. Frugivore et insectivore, il participe activement à la dissémination des graines des arbres fruitiers tropicaux.",
  },
  {
    slug: 'loriot',
    commonName: 'Loriot',
    latinName: 'Oriolus spp.',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🐦',
    shortNote:
      'Souvent perché dans les palmiers, plumage jaune vif.',
    longDescription:
      "D'un jaune d'or éclatant souligné de noir, le loriot se remarque plus à l'oreille qu'à l'œil : son sifflement liquide et roulé traverse la canopée alors qu'il reste caché dans le feuillage. Il se nourrit de fruits mûrs, de nectar et de gros insectes. Sa livrée en fait l'un des plus beaux oiseaux des jardins de l'île.",
  },
  {
    slug: 'mynah',
    commonName: 'Mynah',
    latinName: 'Acridotheres spp.',
    category: 'oiseau',
    danger: 0,
    zones: ['air', 'urbain'],
    icon: '🐦',
    shortNote:
      'Très intelligent, se déplace en couple stable toute sa vie.',
    longDescription:
      "Effronté et remarquablement intelligent, le mynah s'est parfaitement adapté aux villages et aux marchés où il glane restes et insectes. Excellent imitateur, il reproduit sons et paroles avec aisance. Les couples, unis pour la vie, se déplacent et se toilettent ensemble — une fidélité qui frappe l'observateur.",
  },
  {
    slug: 'perruche',
    commonName: 'Perruche',
    latinName: 'Psittacula spp.',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🦜',
    shortNote:
      "Parfois visible en forêt, reconnaissable à son plumage vert et son cri perçant.",
    longDescription:
      "Fusée verte traversant le ciel en criant, la perruche à collier se déplace en petites bandes bruyantes entre dortoirs et arbres fruitiers. Le mâle adulte porte un fin collier rose et noir. Cavernicole, elle niche dans les trous d'arbres et joue un rôle dans la dispersion des graines forestières.",
  },
  {
    slug: 'mouette-sterne',
    commonName: 'Mouette / sterne',
    latinName: 'Laridae',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🐦',
    shortNote:
      'Communes le long des plages, surtout au lever et coucher du soleil.',
    longDescription:
      "Le long des plages et au-dessus du large, mouettes et sternes rythment la vie côtière. Les sternes, plus fines et acrobates, plongent en piqué sur les bancs de petits poissons poussés en surface par les prédateurs. Leurs rassemblements signalent souvent la présence de gros pélagiques chassant en dessous.",
  },
  {
    slug: 'milan-brahminy',
    commonName: 'Milan brahminy',
    latinName: 'Haliastur indus',
    category: 'oiseau',
    danger: 0,
    zones: ['air'],
    icon: '🦅',
    shortNote:
      'Rapace roux et blanc, très présent près des zones côtières et resorts.',
    longDescription:
      "Tête et poitrail d'un blanc pur contrastant avec des ailes acajou, le milan brahminy est le rapace côtier le plus visible du Golfe. Il plane sans effort au-dessus des ports et des plages, happant poissons morts et petits crabes à la surface. Dans plusieurs cultures d'Asie, sa silhouette élégante est chargée de symboles.",
  },
  {
    slug: 'coq-de-combat',
    commonName: 'Coq de combat',
    latinName: 'Gallus gallus domesticus',
    category: 'oiseau',
    danger: 0,
    zones: ['terre'],
    icon: '🐓',
    shortNote:
      'Élevé avec soin par les habitants, sujet de concours traditionnels.',
    longDescription:
      "Descendant du coq bankiva sauvage, le coq de combat thaï est élevé avec un soin méticuleux et une réelle fierté par ses propriétaires. Au plumage flamboyant, il ponctue les villages de ses chants dès l'aube. Au-delà de la tradition, ces oiseaux robustes font partie intégrante du paysage sonore rural de l'île.",
  },

  // ------------------------------------------------ ARACHNIDES & MYRIAPODES
  {
    slug: 'araignee-sauteuse',
    commonName: 'Araignée sauteuse',
    latinName: 'Salticidae spp.',
    category: 'arthropode',
    danger: 0,
    zones: ['terre', 'urbain'],
    icon: '🕷️',
    shortNote:
      'Petite, très bonne vue grâce à ses 8 yeux, inoffensive et curieuse.',
    longDescription:
      "Minuscule chasseresse aux grands yeux frontaux, l'araignée sauteuse possède la meilleure vision du monde des arachnides et bondit sur ses proies avec une précision étonnante, sécurisée par un fil de soie. Curieuse, elle observe volontiers l'humain en tournant la tête. Totalement inoffensive, elle est un délice pour les macro-photographes.",
  },
  {
    slug: 'nephile',
    commonName: 'Néphile (Golden Orb Weaver)',
    latinName: 'Nephila spp.',
    category: 'arthropode',
    danger: 0,
    zones: ['terre'],
    icon: '🕸️',
    shortNote:
      'Tisse de vastes toiles dorées impressionnantes entre les arbres.',
    longDescription:
      "La néphile tisse d'immenses toiles dont la soie, d'un or véritable au soleil, compte parmi les fibres naturelles les plus résistantes connues. La femelle, spectaculaire, éclipse le mâle minuscule qui vit en marge de sa toile. Impressionnante mais inoffensive, elle capture de gros insectes et structure la lisière forestière.",
  },
  {
    slug: 'araignee-crabe-geante',
    commonName: 'Araignée-crabe géante (Huntsman)',
    latinName: 'Sparassidae spp.',
    category: 'arthropode',
    danger: 0,
    zones: ['terre', 'urbain'],
    icon: '🕷️',
    shortNote:
      "Grande et rapide mais peu agressive envers l'humain.",
    longDescription:
      "Aux pattes déployées en couronne pouvant atteindre la taille d'une main, l'araignée-chasseuse ne tisse pas de toile : elle court à toute vitesse sur les murs pour capturer cafards et insectes. Sa vitesse surprend, mais elle fuit l'humain et sa morsure est bénigne. Beaucoup de foyers la tolèrent comme insecticide vivant.",
  },
  {
    slug: 'tarentule',
    commonName: 'Tarentule',
    latinName: 'Theraphosidae spp.',
    category: 'arthropode',
    danger: 1,
    zones: ['terre'],
    icon: '🕷️',
    shortNote:
      'Impressionnante par sa taille ; morsure rare et bénigne dans la plupart des cas.',
    longDescription:
      "La mygale asiatique, souvent noir bleuté, vit dans des terriers tapissés de soie qu'elle quitte la nuit pour chasser. Rapide et défensive, certaines espèces locales possèdent un venin qui, sans être mortel, provoque douleur intense et crampes prolongées. On l'observe sans jamais la manipuler.",
  },
  {
    slug: 'scorpion-noir-thailandais',
    commonName: 'Scorpion noir thaïlandais',
    latinName: 'Heterometrus spp.',
    category: 'arthropode',
    danger: 1,
    zones: ['terre'],
    icon: '🦂',
    shortNote:
      'Piqûre douloureuse mais rarement dangereuse pour un adulte en bonne santé.',
    longDescription:
      "Grand scorpion noir aux pinces massives, il compense un venin relativement faible par une force de préhension redoutable. Sa piqûre, comparable à celle d'une guêpe puissante, reste rarement dangereuse pour un adulte sain. Fluorescent sous lumière UV, il se cache le jour sous les pierres et les écorces.",
  },
  {
    slug: 'scolopendre-geante',
    commonName: 'Scolopendre géante',
    latinName: 'Scolopendra spp.',
    category: 'arthropode',
    danger: 2,
    zones: ['terre', 'urbain'],
    icon: '🐛',
    shortNote:
      'Morsure extrêmement douloureuse ; vérifier chaussures et draps en zone humide.',
    longDescription:
      "Ce mille-pattes carnivore, qui peut dépasser vingt centimètres, est l'un des invertébrés les plus redoutés de la région. Sa morsure, injectée par des crochets venimeux, provoque une douleur atroce, un gonflement marqué et parfois de la fièvre. Nocturne et rapide, elle s'abrite dans les endroits sombres et humides : mieux vaut secouer chaussures et vêtements laissés au sol.",
  },

  // ------------------------------------------------------------------ INSECTES
  {
    slug: 'fourmi-tisserande',
    commonName: 'Fourmi tisserande',
    latinName: 'Oecophylla smaragdina',
    category: 'insecte',
    danger: 1,
    zones: ['terre'],
    icon: '🐜',
    shortNote:
      'Mandibules tranchantes, construit des nids en tissant les feuilles entre elles.',
    longDescription:
      "Ces fourmis rousses cousent littéralement leurs nids : formant des chaînes vivantes, elles rapprochent les feuilles puis les collent avec la soie de leurs larves. Farouchement territoriales, elles mordent et projettent de l'acide formique sur tout intrus. En Thaïlande, leurs larves acidulées sont d'ailleurs un mets recherché.",
  },
  {
    slug: 'mante-religieuse',
    commonName: 'Mante religieuse',
    latinName: 'Mantodea',
    category: 'insecte',
    danger: 0,
    zones: ['terre'],
    icon: '🦗',
    shortNote:
      'Redoutable prédatrice miniature, parfaitement camouflée dans la végétation.',
    longDescription:
      "Immobile comme une brindille ou une fleur, la mante religieuse frappe à la vitesse de l'éclair avec ses pattes ravisseuses garnies d'épines. Seul insecte capable de tourner la tête pour suivre sa proie du regard, elle règne en prédatrice miniature sur la végétation. Les espèces tropicales rivalisent d'ingéniosité dans l'art du camouflage.",
  },
  {
    slug: 'moustique',
    commonName: 'Moustique',
    latinName: 'Culicidae',
    category: 'insecte',
    danger: 1,
    zones: ['terre', 'urbain'],
    icon: '🦟',
    shortNote:
      'Présent toute l’année ; répulsif conseillé, notamment le soir.',
    longDescription:
      "Présent toute l'année sous les tropiques, le moustique est bien plus qu'une nuisance : certaines espèces transmettent dengue et chikungunya, endémiques dans la région. Le moustique-tigre, actif de jour, et les Culex du soir imposent une vigilance constante. Répulsif, vêtements couvrants et élimination des eaux stagnantes restent les meilleures protections.",
  },
  {
    slug: 'cafard',
    commonName: 'Cafard',
    latinName: 'Blattodea',
    category: 'insecte',
    danger: 0,
    zones: ['urbain'],
    icon: '🪳',
    shortNote:
      'Commun en zone urbaine ; régulé naturellement par les geckos tokay.',
    longDescription:
      "Increvable et rapide, le cafard prospère partout où l'humain laisse de la nourriture. Dans le climat tropical, les grandes espèces volent parfois vers les lumières le soir. Peu ragoûtant mais globalement inoffensif, il est efficacement régulé par ses prédateurs naturels : geckos, tokays et araignées-chasseuses.",
  },
  {
    slug: 'papillon',
    commonName: 'Papillon',
    latinName: 'Lepidoptera spp.',
    category: 'insecte',
    danger: 0,
    zones: ['terre'],
    icon: '🦋',
    shortNote:
      'Grande variété d’espèces colorées, particulièrement actives après la pluie.',
    longDescription:
      "Des grands papillons-oiseaux aux ailes irisées aux discrets géomètres, la diversité des lépidoptères explose après les pluies, quand fleurs et flaques minérales abondent. Pollinisateurs essentiels, ils indiquent par leur présence des milieux sains. Certains se rassemblent en nuées colorées pour « boire » les sels des berges humides.",
  },
  {
    slug: 'libellule',
    commonName: 'Libellule',
    latinName: 'Odonata',
    category: 'insecte',
    danger: 0,
    zones: ['terre'],
    icon: '🐉',
    shortNote:
      'Observable près des points d’eau douce et des rizières.',
    longDescription:
      "Chasseresse aérienne parmi les plus efficaces du vivant, la libellule capture ses proies en plein vol avec une précision quasi absolue. Ses larves aquatiques régulent les moustiques dans les rizières et mares. Aux couleurs métalliques, elle patrouille inlassablement les points d'eau douce dès les premières chaleurs du matin.",
  },
  {
    slug: 'luciole',
    commonName: 'Luciole',
    latinName: 'Lampyridae',
    category: 'insecte',
    danger: 0,
    zones: ['terre'],
    icon: '✨',
    shortNote:
      'Spectacle nocturne le long des canaux (khlongs) à la tombée de la nuit.',
    longDescription:
      "À la nuit tombée, les lucioles transforment certaines mangroves et berges de khlongs en constellations clignotantes. Cette lumière froide, produite sans chaleur, sert à séduire : dans certains sites, des colonies entières synchronisent leurs éclats. Sensibles à la pollution lumineuse, elles sont un fragile trésor des nuits tropicales.",
  },
  {
    slug: 'cigale',
    commonName: 'Cigale',
    latinName: 'Cicadidae',
    category: 'insecte',
    danger: 0,
    zones: ['terre'],
    icon: '🎶',
    shortNote:
      'Chant caractéristique et puissant qui rythme les soirées tropicales.',
    longDescription:
      "Bande-son des forêts tropicales, la cigale produit son vacarme grâce à des membranes vibrantes appelées cymbales, capables d'atteindre un volume assourdissant. Après des années passées sous terre à l'état larvaire, l'adulte ne vit que quelques semaines, tout entier consacré au chant et à la reproduction. Ses chœurs saluent la chaleur du jour et la tombée du soir.",
  },

  // --------------------------------------------------------------- VIE MARINE
  {
    slug: 'requin-baleine',
    commonName: 'Requin-baleine',
    latinName: 'Rhincodon typus',
    category: 'marine',
    danger: 0,
    zones: ['large'],
    icon: '🦈',
    shortNote:
      'Le plus grand poisson du monde, inoffensif, filtre plancton et petits poissons.',
    longDescription:
      "Géant absolu des mers, le requin-baleine peut dépasser douze mètres tout en se nourrissant paisiblement de plancton et de petits poissons qu'il filtre par sa gueule béante. Chaque individu porte une constellation de taches blanches aussi unique qu'une empreinte. Le croiser en apnée sur les pinacles du Golfe reste le rêve absolu de tout plongeur — on garde ses distances pour ne pas le perturber.",
    observationSpots: [
      { name: 'Sail Rock (Hin Bai)', lat: 9.898, lng: 100.043 },
      { name: 'Chumphon Pinnacle', lat: 10.183, lng: 99.783 },
    ],
  },
  {
    slug: 'requin-gris-de-recif',
    commonName: 'Requin gris de récif',
    latinName: 'Carcharhinus amblyrhynchos',
    category: 'marine',
    danger: 1,
    zones: ['recif'],
    icon: '🦈',
    shortNote:
      'Peut se montrer curieux mais les attaques restent extrêmement rares.',
    longDescription:
      "Prédateur élégant et musclé des tombants coralliens, le requin gris de récif patrouille souvent en groupe le long des pentes. Curieux, il peut s'approcher des plongeurs, mais les incidents restent exceptionnels tant qu'on ne le provoque pas. Superprédateur, il joue un rôle essentiel dans l'équilibre et la santé du récif.",
  },
  {
    slug: 'requin-leopard',
    commonName: 'Requin-léopard',
    latinName: 'Stegostoma fasciatum',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🦈',
    shortNote:
      'Repose souvent immobile sur le sable, totalement inoffensif.',
    longDescription:
      "Aussi appelé requin-zèbre, ce paisible requin tacheté passe le plus clair de son temps posé sur le sable, à respirer immobile entre deux plongées de chasse nocturne. Sa longue queue quasi aussi longue que son corps le rend inimitable. Parfaitement inoffensif, il se laisse approcher avec délicatesse par les plongeurs respectueux.",
  },
  {
    slug: 'requin-pointes-noires',
    commonName: 'Requin à pointes noires de récif',
    latinName: 'Carcharhinus melanopterus',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🦈',
    shortNote:
      'Fréquente les eaux peu profondes, notamment autour de Shark Bay.',
    longDescription:
      "Reconnaissable aux pointes noires de ses nageoires, ce petit requin timide fréquente les platiers et lagons peu profonds, où l'on aperçoit parfois son aileron affleurer. Craintif, il fuit dès qu'un nageur approche. Autour de Shark Bay à Koh Tao, l'observer en snorkeling est devenu une rencontre emblématique — et totalement sûre.",
    observationSpots: [
      { name: 'Shark Bay (Ao Thian Ok), Koh Tao', lat: 10.061, lng: 99.845 },
    ],
  },
  {
    slug: 'raie-pastenague-taches-bleues',
    commonName: 'Raie pastenague à taches bleues',
    latinName: 'Taeniura lymma',
    category: 'marine',
    danger: 2,
    zones: ['recif'],
    icon: '🐟',
    shortNote:
      'Dard venimeux à la base de la queue ; ne jamais marcher dessus par mégarde.',
    longDescription:
      "Splendide avec ses pois électriques sur fond ocre, cette petite raie se cache sous le sable et les surplombs coralliens. Elle porte à la queue un ou deux dards venimeux capables d'infliger une blessure extrêmement douloureuse si on la surprend ou la piétine. On la contemple sans jamais l'acculer, et l'on traîne les pieds dans les zones sableuses peu profondes.",
  },
  {
    slug: 'raie-manta',
    commonName: 'Raie manta',
    latinName: 'Mobula alfredi',
    category: 'marine',
    danger: 0,
    zones: ['large'],
    icon: '🐟',
    shortNote:
      'Gracieuse nageuse filtreuse, spectacle rare mais mémorable en plongée.',
    longDescription:
      "Planant dans le bleu de ses immenses ailes pouvant dépasser cinq mètres d'envergure, la raie manta filtre le plancton avec une grâce aérienne. Dotée du plus grand cerveau de tous les poissons, elle est curieuse et fréquente les stations de nettoyage. Inoffensive et dépourvue de dard, sa rencontre marque à vie qui la croise.",
  },
  {
    slug: 'merou-geant',
    commonName: 'Mérou géant',
    latinName: 'Epinephelus lanceolatus',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐟',
    shortNote:
      'Peut atteindre plus de 2 mètres, curieux mais généralement placide.',
    longDescription:
      "Colosse pacifique du récif, le mérou géant peut dépasser deux mètres et trois cents kilos, aspirant ses proies dans sa gueule caverneuse. Souvent installé sous une même arche ou épave durant des années, il se montre étonnamment curieux envers les plongeurs. Longévif et lent à se reproduire, il reste vulnérable à la surpêche.",
  },
  {
    slug: 'poisson-ange-six-bandes',
    commonName: 'Poisson-ange à six bandes',
    latinName: 'Pomacanthus sexstriatus',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐠',
    shortNote:
      "Coloré et territorial, l'un des poissons les plus photographiés du récif.",
    longDescription:
      "Grand poisson-ange rayé de bandes verticales et ponctué de bleu électrique, il patrouille son territoire corallien avec assurance. Les juvéniles, à la livrée totalement différente, arborent des cercles bleus et blancs hypnotiques. Il se nourrit d'éponges et de tuniciers, contribuant à l'équilibre délicat du récif.",
  },
  {
    slug: 'poisson-papillon-8-bandes',
    commonName: 'Poisson-papillon à 8 bandes',
    latinName: 'Chaetodon octofasciatus',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐠',
    shortNote:
      'Petit poisson de récif au motif rayé caractéristique.',
    longDescription:
      "Petit disque nacré zébré de fines barres sombres, ce poisson-papillon vit en couple fidèle au-dessus des coraux dont il grignote les polypes. Sa dépendance au corail vivant en fait un excellent indicateur de la santé du récif. Vif et lumineux, il compte parmi les figures familières des jardins coralliens du Golfe.",
  },
  {
    slug: 'labre-nettoyeur',
    commonName: 'Labre nettoyeur',
    latinName: 'Labroides dimidiatus',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐟',
    shortNote:
      "Tient de véritables « stations de nettoyage » pour les autres poissons.",
    longDescription:
      "Minuscule mais indispensable, le labre nettoyeur ouvre de véritables « cliniques » sur le récif où de grands poissons font la queue pour se faire débarrasser parasites et peaux mortes, jusque dans la gueule et les branchies. Sa danse ondulante signale son statut protégé. Ce mutualisme structure la vie sociale de tout le récif.",
  },
  {
    slug: 'poisson-clown',
    commonName: 'Poisson-clown',
    latinName: 'Amphiprion spp.',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐠',
    shortNote:
      'Vit en symbiose avec les anémones de mer, immunisé contre leurs tentacules.',
    longDescription:
      "Protégé par un mucus qui le rend insensible aux tentacules urticants, le poisson-clown vit toute son existence blotti dans son anémone, qu'il défend avec un aplomb comique. Tous naissent mâles : le plus dominant devient femelle, à la tête d'une stricte hiérarchie familiale. Ce lien symbiotique est l'une des plus belles alliances du récif.",
  },
  {
    slug: 'poisson-coffre',
    commonName: 'Poisson-coffre',
    latinName: 'Ostracion cubicus',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐟',
    shortNote:
      'Corps cubique rigide, se déplace lentement mais sûrement.',
    longDescription:
      "Enfermé dans une carapace osseuse quasi cubique, le poisson-coffre nage en agitant comiquement ses seules nageoires, ce qui inspira même des concepts de carrosserie automobile. Le juvénile, petit dé jaune vif ponctué de noir, est irrésistible. Stressé, il peut libérer une toxine dans l'eau — on le regarde donc sans jamais le manipuler.",
  },
  {
    slug: 'poisson-ballon-etoile',
    commonName: 'Poisson-ballon étoilé',
    latinName: 'Arothron stellatus',
    category: 'marine',
    danger: 1,
    zones: ['recif'],
    icon: '🐡',
    shortNote:
      'Se gonfle en cas de danger ; toxique si consommé, à ne jamais toucher.',
    longDescription:
      "Grand poisson-globe piqueté d'étoiles noires, il se gonfle d'eau en une boule dissuasive lorsqu'il se sent menacé. Sa chair et ses organes concentrent une puissante tétrodotoxine, mortelle en cas d'ingestion. Curieux et placide, il ne présente aucun danger tant qu'on ne le stresse ni ne le touche.",
  },
  {
    slug: 'baliste-a-moustache',
    commonName: 'Baliste à moustache',
    latinName: 'Balistoides viridescens',
    category: 'marine',
    danger: 1,
    zones: ['recif'],
    icon: '🐟',
    shortNote:
      'Très territorial en période de nidification, peut mordre les plongeurs.',
    longDescription:
      "Le plus grand des balistes défend son nid, creusé en entonnoir dans le sable, avec une agressivité qui surprend bien des plongeurs. Son territoire s'étend en cône vers la surface : mieux vaut s'éloigner horizontalement qu'en remontant. Ses dents puissantes, faites pour broyer oursins et coraux, peuvent infliger de vraies morsures durant la nidification.",
  },
  {
    slug: 'diodon',
    commonName: 'Diodon (poisson porc-épic)',
    latinName: 'Diodontidae',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐡',
    shortNote:
      "Peau hérissée de longues épines lorsqu'il se gonfle d'eau ou d'air.",
    longDescription:
      "Cousin épineux du poisson-globe, le diodon se gonfle en une boule hérissée de piquants dressés, devenant impossible à avaler pour un prédateur. Ses grands yeux expressifs et son air débonnaire en font une star des plongées de nuit. Au repos, ses épines se couchent sagement le long du corps.",
  },
  {
    slug: 'barracuda',
    commonName: 'Barracuda',
    latinName: 'Sphyraena barracuda',
    category: 'marine',
    danger: 1,
    zones: ['recif', 'large'],
    icon: '🐟',
    shortNote:
      "Prédateur véloce aux dents acérées, impressionnant mais peu agressif envers l'homme.",
    longDescription:
      "Fuselé comme une torpille et armé de dents acérées, le grand barracuda fond sur ses proies à une vitesse foudroyante. Les jeunes forment de spectaculaires bancs tourbillonnants, tandis que les adultes chassent en solitaire. Impressionnant mais indifférent à l'humain, il se contente le plus souvent d'observer les plongeurs à distance.",
  },
  {
    slug: 'vivaneau-des-mangroves',
    commonName: 'Vivaneau des mangroves',
    latinName: 'Lutjanus argentimaculatus',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐟',
    shortNote:
      'Fréquente aussi bien les récifs que les zones de mangrove côtières.',
    longDescription:
      "Robuste vivaneau au reflet cuivré, il navigue entre deux mondes : les jeunes grandissent à l'abri des racines de mangrove avant de rejoindre les récifs adultes. Prédateur nocturne apprécié des pêcheurs, il illustre le lien vital entre mangroves nourricières et récifs. Sa présence témoigne d'une côte encore fonctionnelle.",
  },
  {
    slug: 'hippocampe',
    commonName: 'Hippocampe',
    latinName: 'Hippocampus spp.',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🌊',
    shortNote:
      "Vit dans les herbiers marins ; c'est le mâle qui porte les œufs.",
    longDescription:
      "Ce poisson à tête de cheval nage debout et s'ancre par sa queue préhensile aux herbiers et gorgones. Chez lui, c'est le mâle qui porte les œufs dans une poche ventrale jusqu'à la « naissance » — une inversion des rôles unique. Maître du camouflage et fidèle à son partenaire, il demeure un trésor discret que seuls les guides avertis savent débusquer.",
  },
  {
    slug: 'nudibranche',
    commonName: 'Nudibranche',
    latinName: 'Nudibranchia',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐌',
    shortNote:
      'Limace de mer aux couleurs éclatantes, prisée des photographes sous-marins.',
    longDescription:
      "Joyaux vivants du récif, les nudibranches déclinent une infinité de couleurs fluorescentes qui signalent souvent leur toxicité. Certains recyclent à leur profit les cellules urticantes des proies qu'ils dévorent, d'autres l'énergie d'algues symbiotiques. Lents et minuscules, ces limaces de mer sont la quête favorite des photographes macro.",
  },
  {
    slug: 'poulpe-seiche-calmar',
    commonName: 'Poulpe / seiche / calmar',
    latinName: 'Cephalopoda',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐙',
    shortNote:
      'Maîtres du camouflage, capables de changer de couleur et de texture.',
    longDescription:
      "Les céphalopodes sont les génies des mers : en une fraction de seconde, poulpes et seiches transforment couleur, motif et texture de peau pour disparaître ou communiquer. Doté de neuf « cerveaux » et de bras autonomes, le poulpe résout des problèmes et manie des outils. À la nuit tombée, les observer chasser sur le récif est un spectacle d'intelligence pure.",
  },
  {
    slug: 'crevette-mantis',
    commonName: 'Crevette mantis',
    latinName: 'Stomatopoda',
    category: 'marine',
    danger: 1,
    zones: ['recif'],
    icon: '🦐',
    shortNote:
      'Pince ultra-rapide et puissante, surnommée « pouce fracasseur ».',
    longDescription:
      "Petite mais phénoménale, la crevette-mante frappe avec des appendices qui accélèrent aussi vite qu'une balle de calibre .22, brisant coquilles et même vitres d'aquarium. Ses yeux, parmi les plus complexes du règne animal, perçoivent la lumière polarisée et un spectre de couleurs qui nous échappe. On évite de glisser un doigt dans son terrier.",
  },
  {
    slug: 'remora',
    commonName: 'Rémora',
    latinName: 'Echeneis naucrates',
    category: 'marine',
    danger: 0,
    zones: ['large'],
    icon: '🐟',
    shortNote:
      'Se fixe par ventouse dorsale à requins et tortues pour voyager.',
    longDescription:
      "Coiffé d'une ventouse dorsale — une nageoire modifiée — le rémora s'agrippe aux requins, raies et tortues pour voyager sans effort et récupérer leurs restes de repas. Ce voyageur clandestin nettoie aussi son hôte de ses parasites. Détaché, il n'hésite pas à suivre curieusement les plongeurs, voire à tenter de s'y coller.",
  },
  {
    slug: 'tortue-verte',
    commonName: 'Tortue verte',
    latinName: 'Chelonia mydas',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐢',
    shortNote:
      'Régulièrement croisée en snorkeling autour des récifs de l’archipel.',
    longDescription:
      "Herbivore paisible à l'âge adulte, la tortue verte broute herbiers et algues, entretenant ces prairies sous-marines comme un jardinier. Fidèle à sa plage natale, la femelle y revient pondre après des années et des milliers de kilomètres de voyage. La croiser en apnée autour de l'archipel, remontant respirer en surface, est un moment de grâce — on la suit à distance, sans jamais la toucher.",
    observationSpots: [
      { name: "Parc marin d'Ang Thong — Mae Koh", lat: 9.66, lng: 99.68 },
      { name: 'Japanese Gardens, Koh Tao', lat: 10.12, lng: 99.82 },
    ],
  },
  {
    slug: 'tortue-imbriquee',
    commonName: 'Tortue imbriquée',
    latinName: 'Eretmochelys imbricata',
    category: 'marine',
    danger: 0,
    zones: ['recif'],
    icon: '🐢',
    shortNote:
      "Reconnaissable à son bec pointu, se nourrit notamment d'éponges.",
    longDescription:
      "Reconnaissable à son bec crochu et à sa dossière aux écailles imbriquées comme des tuiles, la tortue imbriquée se faufile dans les anfractuosités du récif pour y dévorer les éponges, régulant des espèces qui étoufferaient sinon les coraux. Longtemps massacrée pour son « écaille », elle est aujourd'hui en danger critique et strictement protégée. Chaque rencontre est un privilège fragile.",
    observationSpots: [
      { name: 'Japanese Gardens, Koh Tao', lat: 10.12, lng: 99.82 },
    ],
  },
];
