'use client';

import React from 'react';
import './momo-field.css';

export interface SiriusMomoFieldProps {
  /** Contenu de la carte (champ de saisie, avatar, actions de Momo) */
  children?: React.ReactNode;
  className?: string;
}

/**
 * La carte de Momo, le compagnon IA de Sen Kheweul Store (l'équivalent du
 * Sidekick de l'admin de référence). Pour l'instant une coque : rayon, ombre, hauteur.
 * Le contenu arrivera avec les valeurs relevées sur la référence.
 */
export function SiriusMomoField({ children, className = '' }: SiriusMomoFieldProps) {
  return <div className={`sirius-momo-field ${className}`.trim()}>{children}</div>;
}
