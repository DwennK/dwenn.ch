import type { Lang, PageKey } from './site';

export type ProjectKey = Extract<PageKey, 'pos' | 'salaires' | 'canapey'>;

export interface ProjectCopy {
  category: string;
  tagline: string;
  lead: string;
  origin: string;
  challenge: string;
  approach: string;
  features: { title: string; text: string }[];
  detailTitle: string;
  detailText: string;
  status: string;
  caption: string;
  imageAlt: string;
  image2Alt: string;
}

export type Project = {
  key: ProjectKey;
  slug: string;
  name: string;
  number: string;
  image: string;
  image2: string;
  color: string;
  stack: string[];
  repo: string;
} & Record<Lang, ProjectCopy>;

export const projects: Project[] = [
  {
    key: 'pos',
    slug: 'pos-telephonie',
    name: 'POS Téléphonie',
    number: '01',
    image: '/images/projects/pos-telephonie.webp',
    image2: '/images/projects/pos-telephonie-payment.webp',
    color: '#202226',
    stack: ['Nuxt', 'Vue', 'TypeScript', 'Drizzle', 'Turso / libSQL', 'Cloudflare Workers'],
    repo: 'https://github.com/DwennK/004-Nuxt',
    fr: {
      category: 'Application web',
      tagline: 'Un logiciel pour les magasins de téléphonie.',
      lead: 'J’ai développé une application pour gérer les réparations, les ventes, les factures, les paiements et le stock. J’en ai conçu l’interface, les API et le modèle de données.',
      origin: 'Une réparation implique un client, un appareil, un devis et plusieurs interventions. Je voulais réunir ces informations dans un dossier que l’on peut suivre jusqu’à la restitution du téléphone.',
      challenge: 'Le dossier de réparation, la facture et le paiement ont chacun leur état. Je les ai séparés dans le modèle de données pour suivre une intervention sans confondre son avancement avec son règlement.',
      approach: 'L’interface utilise Nuxt et Vue. Les API appliquent les validations et les droits d’accès côté serveur. Drizzle et Turso gèrent les données. Le projet est configuré pour Cloudflare Workers.',
      features: [
        { title: 'Réparations', text: 'Dossiers clients, appareils, problèmes signalés, étapes de suivi et documents associés.' },
        { title: 'Ventes et paiements', text: 'Ventes au comptoir, devis, commandes, factures, enregistrement des règlements et des remboursements.' },
        { title: 'Stock et rapports', text: 'Catalogue, stock de smartphones, réservations et rapports d’activité du magasin.' },
      ],
      detailTitle: 'Factures et paiements',
      detailText: 'L’encaissement est enregistré séparément de la facture. L’interface permet de retrouver le règlement, d’imprimer le document ou de produire un PDF.',
      status: 'Application web · version de développement',
      caption: 'Captures réelles de développement, avec des données de test.',
      imageAlt: 'POS Téléphonie : dossier de réparation fictif avec étapes de suivi, appareil et règlement.',
      image2Alt: 'POS Téléphonie : confirmation d’un encaissement fictif de 100 CHF et options d’impression de la facture de test.',
    },
    en: {
      category: 'Web application',
      tagline: 'Software for phone shops.',
      lead: 'I built an application for managing repairs, sales, invoices, payment records and stock. My work covers the interface, APIs and data model.',
      origin: 'A repair involves a customer, a device, a quote and several tasks. I wanted to keep that information in a case that can be followed until the phone is returned.',
      challenge: 'The repair case, invoice and payment each have their own status. I kept them separate in the data model so that repair progress and payment status can be tracked independently.',
      approach: 'The interface uses Nuxt and Vue. Server APIs handle validation and access permissions. Drizzle and Turso manage the data. The project is configured for Cloudflare Workers.',
      features: [
        { title: 'Repairs', text: 'Customer records, devices, reported issues, repair stages and related documents.' },
        { title: 'Sales and payments', text: 'Counter sales, quotes, orders, invoices, and records of payments and refunds.' },
        { title: 'Stock and reports', text: 'Product catalog, smartphone inventory, reservations and shop activity reports.' },
      ],
      detailTitle: 'Invoices and payments',
      detailText: 'Payments are recorded separately from invoices. The interface lets users find the payment, print the document or generate a PDF.',
      status: 'Web application · development version',
      caption: 'Actual development screenshots with test data.',
      imageAlt: 'POS Téléphonie: a fictional repair case with workflow stages, device information and payment details.',
      image2Alt: 'POS Téléphonie: confirmation of a fictional CHF 100 payment and print options for the test invoice.',
    },
  },
  {
    key: 'salaires',
    slug: 'easy-salaires',
    name: 'Easy Salaires',
    number: '02',
    image: '/images/projects/easy-salaires.webp',
    image2: '/images/projects/easy-salaires-monthly.webp',
    color: '#232528',
    stack: ['Tauri', 'Vue', 'TypeScript', 'Rust', 'SQLite'],
    repo: 'https://github.com/DwennK/Easy-Salaires',
    fr: {
      category: 'Application desktop',
      tagline: 'Un logiciel gratuit pour préparer les salaires.',
      lead: 'Easy Salaires réunit les employés, les calculs et les fiches de paie dans une application locale. Je l’ai créé pour proposer un outil gratuit aux petites entreprises.',
      origin: 'Je voulais pouvoir consulter une année de salaires, préparer les fiches et retrouver les documents déjà émis sans passer d’un fichier à l’autre.',
      challenge: 'Un salaire calculé, un montant payé et une fiche émise sont des informations différentes. L’application les conserve séparément, avec un historique des révisions des documents.',
      approach: 'J’ai construit une vue annuelle avec Vue et TypeScript. Tauri et Rust donnent accès à une base SQLite locale par entreprise. Les données peuvent être sauvegardées et restaurées.',
      features: [
        { title: 'Suivi annuel', text: 'Douze mois par employé, avec salaires mensuels ou horaires, compléments, retenues et paiements enregistrés.' },
        { title: 'Documents et exports', text: 'Fiches de paie PDF, historique des révisions et exports annuels CSV ou Excel.' },
        { title: 'Données locales', text: 'Une base par entreprise sur l’ordinateur, avec sauvegarde et restauration.' },
      ],
      detailTitle: 'Fiches et historique',
      detailText: 'La vue mensuelle permet de retrouver les fiches émises et celles qui restent à préparer. Les paramètres de paie sont à adapter à la situation de l’entreprise.',
      status: 'Application gratuite · macOS et Windows',
      caption: 'Mode démonstration : entreprise, employés et montants fictifs.',
      imageAlt: 'Easy Salaires : vue annuelle de démonstration avec douze mois de salaire et le suivi des paiements d’un employé fictif.',
      image2Alt: 'Easy Salaires : aperçu mensuel de l’entreprise fictive Atelier du Lac, avec fiches émises et actions à effectuer.',
    },
    en: {
      category: 'Desktop application',
      tagline: 'Free software for preparing payroll.',
      lead: 'Easy Salaires brings employee records, calculations and payslips together in a local application. I created it as a free tool for small businesses.',
      origin: 'I wanted to review a full year of payroll, prepare payslips and find previously issued documents without switching between files.',
      challenge: 'Calculated pay, the amount paid and an issued payslip are different records. The application keeps them separate and retains a revision history for documents.',
      approach: 'I built an annual workspace with Vue and TypeScript. Tauri and Rust connect it to a local SQLite database for each company. Data can be backed up and restored.',
      features: [
        { title: 'Annual overview', text: 'Twelve months per employee, with monthly or hourly pay, additions, deductions and recorded payments.' },
        { title: 'Documents and exports', text: 'PDF payslips, revision history and annual CSV or Excel exports.' },
        { title: 'Local data', text: 'A separate database for each company on the computer, with backup and restore.' },
      ],
      detailTitle: 'Payslips and history',
      detailText: 'The monthly overview shows issued payslips and those still to prepare. Payroll settings need to be adjusted to the company’s circumstances.',
      status: 'Free application · macOS and Windows',
      caption: 'Demo mode: fictional company, employees and amounts.',
      imageAlt: 'Easy Salaires: an annual demo workspace showing twelve months of payroll and payments for a fictional employee.',
      image2Alt: 'Easy Salaires: a monthly overview for the fictional Atelier du Lac company, showing issued payslips and next actions.',
    },
  },
  {
    key: 'canapey',
    slug: 'canapey',
    name: 'Canapey',
    number: '03',
    image: '/images/projects/canapey.webp',
    image2: '/images/projects/canapey-ambience.webp',
    color: '#1c1e21',
    stack: ['Tauri', 'Rust', 'Vue', 'TypeScript'],
    repo: 'https://github.com/DwennK/canapey-launcher',
    fr: {
      category: 'Application Windows',
      tagline: 'Un launcher pour le PC du salon.',
      lead: 'Je développe Canapey pour lancer mes jeux et applications depuis le canapé. L’interface est prévue pour une télévision, avec une navigation à la manette et au clavier.',
      origin: 'Je voulais utiliser mon PC dans le salon sans reprendre la souris à chaque lancement. J’ai commencé par une interface lisible à distance et une bibliothèque de raccourcis.',
      challenge: 'La sélection doit rester visible et les déplacements prévisibles à la manette. Il faut aussi gérer le lancement des applications et le retour au launcher sur Windows.',
      approach: 'Vue et TypeScript portent l’interface. Tauri et Rust assurent les fonctions natives Windows, dont le lancement des applications et le suivi des sessions.',
      features: [
        { title: 'Navigation à distance', text: 'Sélection visible, grands éléments et déplacements prévus pour la manette, le clavier et la souris.' },
        { title: 'Bibliothèque personnelle', text: 'Applications et raccourcis, affichage en carrousel ou en grille, visuels personnalisables.' },
        { title: 'Intégration Windows', text: 'Lancement des applications et suivi des sessions via la couche native Rust.' },
      ],
      detailTitle: 'L’interface et Windows',
      detailText: 'Le décor change avec l’application sélectionnée. Le projet reste expérimental : les captures montrent l’aperçu web, pas une validation des fonctions natives sur un PC Windows.',
      status: 'Expérimental · Windows 11 x64',
      caption: 'Interface réelle en aperçu web. Les applications « À ajouter » sont des suggestions.',
      imageAlt: 'Canapey : accueil de l’aperçu web avec un paysage alpin et un carrousel de suggestions d’applications.',
      image2Alt: 'Canapey : la suggestion Spotify sélectionnée affiche un décor de platine vinyle aux tons verts.',
    },
    en: {
      category: 'Windows application',
      tagline: 'A launcher for the living-room PC.',
      lead: 'I’m building Canapey to launch my games and applications from the sofa. The interface is designed for a TV, with controller and keyboard navigation.',
      origin: 'I wanted to use my living-room PC without reaching for the mouse every time I launched something. I started with an interface readable at a distance and a library of shortcuts.',
      challenge: 'Selection needs to stay visible and controller navigation needs to be predictable. The launcher also needs to start applications and handle the return to its interface on Windows.',
      approach: 'Vue and TypeScript power the interface. Tauri and Rust handle native Windows functions, including application launching and session tracking.',
      features: [
        { title: 'Navigation from the sofa', text: 'Visible selection, large controls and navigation designed for controllers, keyboards and mice.' },
        { title: 'Personal library', text: 'Applications and shortcuts, carousel or grid views, and customizable artwork.' },
        { title: 'Windows integration', text: 'Application launching and session tracking through the native Rust layer.' },
      ],
      detailTitle: 'The interface and Windows',
      detailText: 'The backdrop changes with the selected application. The project remains experimental: these screenshots show the browser preview, not validation of native functions on a Windows PC.',
      status: 'Experimental · Windows 11 x64',
      caption: 'Actual interface in browser preview. Apps marked “À ajouter” are suggestions.',
      imageAlt: 'Canapey: browser-preview home screen with an alpine landscape and a carousel of suggested applications.',
      image2Alt: 'Canapey: selecting the Spotify suggestion displays a green-toned turntable backdrop.',
    },
  },
];
