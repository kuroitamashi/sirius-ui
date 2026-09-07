'use client';

import React from 'react';
import './spinner.css';

export interface SiriusSpinnerProps {
  /**
   * Taille du spinner
   * - small: 20px (comme dans Figma)
   * - large: 44px (comme dans Figma)
   */
  size?: 'small' | 'large';
  /**
   * Label accessible pour lecteurs d'écran
   */
  accessibilityLabel?: string;
  /**
   * Couleur / tonalité du spinner
   */
  tone?: 'default' | 'primary' | 'subdued' | 'inherit';
  className?: string;
}

export function SiriusSpinner({
  size = 'large',
  accessibilityLabel = 'Chargement en cours...',
  tone = 'default',
  className = '',
}: SiriusSpinnerProps) {
  const isSmall = size === 'small';
  const dimension = isSmall ? 20 : 44;
  const strokeWidth = isSmall ? 2.5 : 3.5;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc visible d'environ 28% de la circonférence
  const arcLength = circumference * 0.28;

  return (
    <span
      className={`sirius-spinner sirius-spinner--${size} sirius-spinner--${tone} ${className}`}
      role="status"
      aria-label={accessibilityLabel}
    >
      <svg
        viewBox={`0 0 ${dimension} ${dimension}`}
        width={dimension}
        height={dimension}
        className="sirius-spinner__svg"
        aria-hidden="true"
      >
        {/* Cercle piste d'arrière-plan */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          className="sirius-spinner__track"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Arc rotatif */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          className="sirius-spinner__arc"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="sirius-visually-hidden">{accessibilityLabel}</span>
    </span>
  );
}
