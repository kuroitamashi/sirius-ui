'use client';

import React, { useState, useRef } from 'react';
import './tooltip.css';

export interface SiriusTooltipProps {
  /**
   * Contenu affiché dans l'info-bulle
   */
  content: React.ReactNode;
  /**
   * Position souhaitée de l'info-bulle par rapport à la cible
   * - 'above' : Au-dessus, le bec pointe vers le bas
   * - 'below' : En-dessous, le bec pointe vers le haut
   */
  preferredPosition?: 'above' | 'below';
  children?: React.ReactNode;
  className?: string;
}

/**
 * Composant interactif Tooltip Sirius
 * S'affiche au survol et au focus du composant enfant
 */
export function SiriusTooltip({
  content,
  preferredPosition = 'above',
  children,
  className = '',
}: SiriusTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 80);
  };

  return (
    <div
      className={['sirius-tooltip-wrapper', className].filter(Boolean).join(' ')}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          className={`sirius-tooltip-bubble sirius-tooltip-bubble--${preferredPosition}`}
          role="tooltip"
        >
          <div className="sirius-tooltip-beak" />
          <div className="sirius-tooltip-content">{content}</div>
        </div>
      )}
    </div>
  );
}

export interface SiriusTooltipBubbleProps {
  position?: 'above' | 'below';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Bulle statique d'info-bulle reproduisant fidèlement la maquette Figma ❖ Tooltip
 */
export function SiriusTooltipBubble({
  position = 'above',
  children,
  className = '',
  style,
}: SiriusTooltipBubbleProps) {
  return (
    <div
      className={[
        'sirius-tooltip-bubble',
        'sirius-tooltip-bubble--static',
        `sirius-tooltip-bubble--${position}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <div className="sirius-tooltip-beak" />
      <div className="sirius-tooltip-content">{children}</div>
    </div>
  );
}

export default SiriusTooltip;
