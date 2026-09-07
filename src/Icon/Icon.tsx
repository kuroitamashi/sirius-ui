import React from 'react';
import { SIRIUS_ICONS, ICON_ALIASES } from './sirius-icons';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Composant Icon officiel basé sur les icônes Sirius UI.
 * - viewBox: 0 0 20 20
 * - fill: "currentColor" (hérite des couleurs CSS, hover, états actifs et thèmes)
 * - Rétrocompatibilité totale avec tous les alias historiques et noms de fichiers Sirius.
 */
export function Icon({ name, size = 16, className, style, ...props }: IconProps) {
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
