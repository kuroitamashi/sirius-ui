'use client';

import React from 'react';
import './button-group.css';

export interface SiriusButtonGroupProps {
  children?: React.ReactNode;
  /** Regroupe visuellement les boutons en un seul bloc (style segmenté / scindé) */
  connected?: boolean;
  /** Alias Polaris pour connected */
  segmented?: boolean;
  /** Variante Polaris ('segmented' active le mode connecté) */
  variant?: 'segmented' | 'default';
  className?: string;
}

export function SiriusButtonGroup({
  children,
  connected = false,
  segmented = false,
  variant,
  className = '',
}: SiriusButtonGroupProps) {
  const isSegmented = connected || segmented || variant === 'segmented';

  return (
    <div
      className={[
        'sirius-button-group',
        isSegmented && 'sirius-button-group--connected',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="group"
    >
      {children}
    </div>
  );
}
