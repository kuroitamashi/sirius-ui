'use client';

import React from 'react';
import './divider.css';

export interface SiriusDividerProps {
  /**
   * Orientation du séparateur
   * - 'horizontal' (défaut)
   * - 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Séparateur officiel Sirius / Sirius
 * Conforme au composant Figma ❖ Divider
 */
export function SiriusDivider({
  orientation = 'horizontal',
  className = '',
  style,
}: SiriusDividerProps) {
  return (
    <hr
      className={['sirius-divider', `sirius-divider--${orientation}`, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-orientation={orientation}
    />
  );
}

export default SiriusDivider;
