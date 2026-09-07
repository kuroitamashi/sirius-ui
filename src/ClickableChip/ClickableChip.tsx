'use client';

import React from 'react';
import './clickable-chip.css';

export interface SiriusClickableChipProps {
  children: React.ReactNode;
  selected?: boolean;
  variant?: 'default' | 'outline';
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function SiriusClickableChip({
  children,
  selected = false,
  variant = 'default',
  disabled = false,
  onClick,
  icon,
  className = '',
}: SiriusClickableChipProps) {
  return (
    <button
      type="button"
      className={[
        'sirius-chip',
        `sirius-chip--${variant}`,
        selected && 'sirius-chip--selected',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
    >
      {icon && <span className="sirius-chip__icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
