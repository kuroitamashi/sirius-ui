'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import './thumbnail.css';

export interface SiriusThumbnailProps {
  /** Image du produit. Sans image, une icône grise la remplace. */
  source?: string;
  alt: string;
  /** 24, 36 (défaut, ligne de tableau), 60 ou 80 px. */
  size?: 'extraSmall' | 'small' | 'medium' | 'large';
}

/** Vignette carrée d'un produit : coins 8 px, liseré clair, image recadrée. */
export function SiriusThumbnail({ source, alt, size = 'small' }: SiriusThumbnailProps) {
  return (
    <span className={`sirius-thumbnail sirius-thumbnail--${size}`}>
      {source ? <img src={source} alt={alt} loading="lazy" /> : <Icon name="image" size={size === 'extraSmall' ? 16 : 20} aria-label={alt} />}
    </span>
  );
}
