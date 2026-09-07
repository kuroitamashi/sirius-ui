'use client';

import React from 'react';
import './list.css';

export interface SiriusListProps {
  /**
   * Type de liste :
   * - 'bullet' (liste non ordonnée à puces)
   * - 'number' (liste ordonnée numérotée)
   */
  type?: 'bullet' | 'number';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SiriusListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function SiriusListItem({ children, className = '' }: SiriusListItemProps) {
  return (
    <li className={['sirius-list__item', className].filter(Boolean).join(' ')}>
      {children}
    </li>
  );
}

/**
 * Listes typographiques Sirius UI / Sirius
 * Reproduction 1:1 des composants Figma ❖ OrderedList et ❖ UnorderedList
 */
export function SiriusList({
  type = 'bullet',
  children,
  className = '',
  style,
}: SiriusListProps) {
  const Component = type === 'number' ? 'ol' : 'ul';

  return (
    <Component
      className={[
        'sirius-list',
        `sirius-list--${type}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </Component>
  );
}

export default SiriusList;
