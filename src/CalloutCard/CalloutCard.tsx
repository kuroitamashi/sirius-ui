'use client';

import React from 'react';
import { SiriusButton, type SiriusButtonProps } from '../Button/Button';
import type { IconName } from '../Icon/Icon';
import './callout-card.css';

export interface SiriusCalloutCardAction {
  content: string;
  onAction?: () => void;
  url?: string;
  /** Icône Sirius à gauche du texte, en 20 px */
  icon?: IconName;
  /** Par défaut : blanc pour l'action principale, nu pour la secondaire */
  variant?: SiriusButtonProps['variant'];
}

export interface SiriusCalloutCardProps {
  /** Titre de la carte, du texte ou un nœud (ex. titre + Badge « Nouveau ») */
  title: React.ReactNode;
  /** Texte d'invitation sous le titre */
  children?: React.ReactNode;
  /** Adresse de l'illustration, affichée à droite en 100 px de large */
  illustration?: string;
  primaryAction?: SiriusCalloutCardAction;
  secondaryAction?: SiriusCalloutCardAction;
  /** Affiche la croix. Le composant ne retient rien : c'est l'écran qui
      mémorise la fermeture pour que la carte ne revienne pas. */
  onDismiss?: () => void;
  className?: string;
}

function ActionButton({ action, fallback }: { action: SiriusCalloutCardAction; fallback: SiriusButtonProps['variant'] }) {
  return (
    <SiriusButton
      variant={action.variant ?? fallback}
      icon={action.icon}
      href={action.url}
      onClick={action.onAction}
    >
      {action.content}
    </SiriusButton>
  );
}

/**
 * Carte d'invitation posée dans une page pour pousser le marchand vers une
 * fonction qu'il n'utilise pas encore. Gabarit Polaris CalloutCard, direction
 * artistique Sirius (coins 16 px, biseau, boutons en pilule).
 */
export function SiriusCalloutCard({
  title,
  children,
  illustration,
  primaryAction,
  secondaryAction,
  onDismiss,
  className = '',
}: SiriusCalloutCardProps) {
  const classes = ['sirius-callout-card', onDismiss && 'sirius-callout-card--dismissible', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="sirius-callout-card__content">
        <h2 className="sirius-callout-card__title">{title}</h2>
        {children && <div className="sirius-callout-card__body">{children}</div>}
        {(primaryAction || secondaryAction) && (
          <div className="sirius-callout-card__actions">
            {primaryAction && <ActionButton action={primaryAction} fallback="default" />}
            {secondaryAction && <ActionButton action={secondaryAction} fallback="plain" />}
          </div>
        )}
      </div>
      {illustration && <img className="sirius-callout-card__illustration" src={illustration} alt="" />}
      {onDismiss && (
        <SiriusButton
          className="sirius-callout-card__dismiss"
          variant="plain"
          iconOnly
          icon="x"
          onClick={onDismiss}
          ariaLabel="Fermer"
        />
      )}
    </div>
  );
}
