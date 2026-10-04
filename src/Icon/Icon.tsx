import * as PolarisIcons from '@shopify/polaris-icons';
import { SIRIUS_ICONS, ICON_ALIASES } from './sirius-icons';

/** Mapping direct vers les nouvelles icônes officielles Shopify Polaris */
const POLARIS_MAP: Record<string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
  // Navigation principale
  dashboard: PolarisIcons.HomeIcon,
  home: PolarisIcons.HomeIcon,
  accueil: PolarisIcons.HomeIcon,
  commandes: PolarisIcons.OrderIcon,
  orders: PolarisIcons.OrderIcon,
  produits: PolarisIcons.ProductIcon,
  products: PolarisIcons.ProductIcon,
  clients: PolarisIcons.PersonIcon,
  customers: PolarisIcons.PersonIcon,
  promotions: PolarisIcons.DiscountIcon,
  discounts: PolarisIcons.DiscountIcon,
  promo: PolarisIcons.DiscountIcon,
  templates: PolarisIcons.ThemeTemplateIcon,
  themes: PolarisIcons.ThemeTemplateIcon,
  reglages: PolarisIcons.SettingsIcon,
  settings: PolarisIcons.SettingsIcon,
  // Contrôles & UI
  search: PolarisIcons.SearchIcon,
  recherche: PolarisIcons.SearchIcon,
  menu: PolarisIcons.MenuIcon,
  sidebar: PolarisIcons.LayoutSidebarLeftIcon,
  cloche: PolarisIcons.NotificationIcon,
  notifications: PolarisIcons.NotificationIcon,
  boutiques: PolarisIcons.StoreIcon,
  utilisateurs: PolarisIcons.PersonIcon,
  facturation: PolarisIcons.OrderDraftIcon,
  inactivite: PolarisIcons.ProfileIcon,
};

/** Nom d'une icone du jeu Sirius, alias historiques compris.
    SIRIUS_ICONS est un Record<string, ...>, donc tout nom est accepte a la
    compilation et resolu a l'execution : un nom inconnu rend null. */
export type IconName = string;

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Composant Icon officiel basé sur les icônes Sirius UI & Shopify Polaris.
 * - viewBox: 0 0 20 20
 * - fill: "currentColor" (hérite des couleurs CSS, hover, états actifs et thèmes)
 * - Priorité aux nouvelles icônes Shopify Polaris avec fallback fluide sur Sirius UI.
 */
export function Icon({ name, size = 16, className, style, ...props }: IconProps) {
  const PolarisComp = POLARIS_MAP[name] || POLARIS_MAP[ICON_ALIASES[name]];
  if (PolarisComp) {
    return (
      <PolarisComp
        width={size}
        height={size}
        className={className}
        style={{ fill: 'currentColor', ...style }}
        aria-hidden="true"
        focusable="false"
        {...props}
      />
    );
  }

  const glyph = SIRIUS_ICONS[name] || SIRIUS_ICONS[ICON_ALIASES[name]];
  if (!glyph) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {glyph.map((pathData, idx) => (
        <path
          key={idx}
          d={pathData[0]}
          fillRule={pathData[1] === 1 ? 'evenodd' : undefined}
          clipRule={pathData[1] === 1 ? 'evenodd' : undefined}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export default Icon;
