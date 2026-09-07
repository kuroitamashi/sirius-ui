'use client';

import React from 'react';
import './button-group.css';

export interface SiriusButtonGroupProps {
  children: React.ReactNode;
  connected?: boolean;
  className?: string;
}

export function SiriusButtonGroup({
  children,
  connected = false,
  className = '',
}: SiriusButtonGroupProps) {
  return (
    <div
      className={[
        'sirius-button-group',
        connected && 'sirius-button-group--connected',
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
