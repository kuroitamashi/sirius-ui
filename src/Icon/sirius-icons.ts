import rawIcons from './sirius-icons.json';

export type SiriusIconData = [d: string, isEvenOdd?: number][];

export const SIRIUS_ICONS = rawIcons as unknown as Record<string, SiriusIconData>;

/**
 * Table de correspondance conservant une compatibilité stricte à 100%
 * avec les alias historiques du projet (français et Lucide)
 * tout en redirigeant vers les glyphes officiels Sirius UI.
 */
export const ICON_ALIASES: Record<string, string> = {
  // Navigation & Sections principales
  dashboard: 'home',
  produits: 'product',
  commandes: 'order',
  paiements: 'payment',
  promotions: 'discount',
  categories: 'collection',
  clients: 'person',
  analytics: 'chart-vertical',
  growth: 'chart-histogram-growth',
  templates: 'theme-template',
  personnalisation: 'theme-edit',
  contenu: 'blog',
  utilisateurs: 'profile',
  abonnement: 'credit-card',
  reglages: 'settings',
  boutiques: 'store',

  // Topbar, Recherche & Actions
  search: 'search',
  bell: 'notification',
  ia: 'wand',
  calendar: 'calendar',
  chevron: 'chevron-right',
  'chevron-left': 'chevron-left',
  'chevron-down': 'chevron-down',
  info: 'info',
  plus: 'plus',
  x: 'x',
  croix: 'x',
  close: 'x',
  dots: 'menu-horizontal',
  menu: 'menu',
  'panel-close': 'layout-sidebar-left',
  'panel-open': 'layout-sidebar-left',
  edit: 'edit',
  copy: 'duplicate',
  trash: 'delete',
  sort: 'sort',
  upload: 'upload',
  guide: 'compass',
  aide: 'question-circle',
  communaute: 'chat',
  avis: 'star',
  check: 'check',
  truck: 'delivery',
  colonnes: 'layout-columns-3',
  'fleche-haut': 'arrow-up',
  tag: 'product',
  'fleche-bas': 'arrow-down',
  oeil: 'view',
  'oeil-barre': 'hide',

  // Rich Text Editor Toolbar (ui/RichText)
  bold: 'text-bold',
  italic: 'text-italic',
  underline: 'text-underline',
  'align-left': 'text-align-left',
  'align-center': 'text-align-center',
  'align-right': 'text-align-right',
  'align-justify': 'text-align-left',
  link: 'link',
  table: 'table',
  'list-bullet': 'list-bulleted',
  'list-ordered': 'list-numbered',
  indent: 'text-indent',
  outdent: 'outdent',
  'clear-format': 'eraser',
  code: 'code',
  return: 'enter',
};
