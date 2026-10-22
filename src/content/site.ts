export type Lang = 'fr' | 'en';
export type PageKey = 'home' | 'work' | 'about' | 'contact' | 'pos' | 'salaires' | 'canapey';
export const routes: Record<PageKey, Record<Lang, string>> = {
  home: { fr: '/', en: '/en/' },
  work: { fr: '/realisations/', en: '/en/work/' },
  about: { fr: '/a-propos/', en: '/en/about/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  pos: { fr: '/realisations/pos-telephonie/', en: '/en/work/pos-telephonie/' },
  salaires: { fr: '/realisations/easy-salaires/', en: '/en/work/easy-salaires/' },
  canapey: { fr: '/realisations/canapey/', en: '/en/work/canapey/' },
};
export const path = (key: PageKey, lang: Lang) => routes[key][lang];
export const profile = {
  name: 'Dwenn Kaufmann', email: 'hello@dwenn.ch',
  github: 'https://github.com/DwennK', linkedin: 'https://ch.linkedin.com/in/dwenn-kaufmann',
  portrait: '/images/portrait.avif', childhoodPhoto: '',
};
export const ui = {
  fr: { home: 'Accueil', work: 'Projets', about: 'À propos', contact: 'Parlons de votre projet', role: 'Développeur full stack', location: 'Neuchâtel, Suisse', skip: 'Aller au contenu', menu: 'Ouvrir la navigation', close: 'Fermer la navigation', see: 'Voir le projet', back: 'Toutes les réalisations', footer: 'Un site, un logiciel ou un projet à reprendre ? Écrivez-moi.', copyright: 'Dwenn Kaufmann · Neuchâtel, Suisse', language: 'Switch to English', tech: 'Design, développement et intégrations.' },
  en: { home: 'Home', work: 'Work', about: 'About', contact: 'Tell me about your project', role: 'Full stack developer', location: 'Neuchâtel, Switzerland', skip: 'Skip to content', menu: 'Open navigation', close: 'Close navigation', see: 'Explore the project', back: 'All projects', footer: 'A website, an application or an existing project? Get in touch.', copyright: 'Dwenn Kaufmann · Neuchâtel, Switzerland', language: 'Passer en français', tech: 'Design, development and integrations.' },
};
