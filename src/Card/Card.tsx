'use client';

import React from 'react';
import { SiriusButton, type SiriusButtonProps } from '../Button/Button';
import './card.css';

export interface SiriusCardAction {
  /** Libellé du bouton */
  text?: string;
  /** Alias Polaris pour text */
  content?: string;
  /** Gestionnaire de clic */
  onAction?: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** État de chargement */
  loading?: boolean;
  /** Désactivé */
  disabled?: boolean;
  /** Action destructrice */
  destructive?: boolean;
  /** Variante spécifique */
  variant?: SiriusButtonProps['variant'];
}

export interface SiriusCardSectionProps {
  /** Titre optionnel de la section */
  title?: React.ReactNode;
  /** Action contextuelle spécifique à cette section */
  actions?: React.ReactNode;
  /** Applique un fond atténué/subdued sur la section (ex: contenu inactif ou secondaire) */
  subdued?: boolean;
  /** Supprime la marge intérieure pour intégrer un tableau ou une image bord à bord */
  flush?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface SiriusCardProps {
  /** Titre de la carte */
  title?: React.ReactNode;
  /** Sous-titre ou description concise sous le titre */
  subtitle?: React.ReactNode;
  /** Action simple à droite de l'en-tête */
  action?: React.ReactNode;
  /** Actions multiples ou composants riches à droite de l'en-tête */
  actions?: React.ReactNode;
  /** Contenu de la carte ou sections */
  children?: React.ReactNode;
  /** Marge intérieure active par défaut sur le corps */
  padded?: boolean;
  /** Applique un fond atténué sur l'ensemble de la carte */
  subdued?: boolean;
  /** Pied de page personnalisé */
  footer?: React.ReactNode;
  /** Action principale de pied de page (bouton primary aligné à droite) */
  primaryFooterAction?: SiriusCardAction;
  /** Actions secondaires de pied de page (boutons blancs à gauche de l'action principale) */
  secondaryFooterActions?: SiriusCardAction[];
  className?: string;
}

export function SiriusCardSection({
  title,
  actions,
  subdued = false,
  flush = false,
  children,
  className = '',
}: SiriusCardSectionProps) {
  const hasSectionHeader = Boolean(title || actions);

  const classes = [
    'sirius-card__section',
    subdued && 'sirius-card__section--subdued',
    flush && 'sirius-card__section--flush',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {hasSectionHeader && (
        <div className="sirius-card__section-header">
          {title && (
            <div className="sirius-card__section-title">
              {typeof title === 'string' ? <h3>{title}</h3> : title}
            </div>
          )}
          {actions && <div className="sirius-card__section-actions">{actions}</div>}
        </div>
      )}
      <div className={flush ? '' : 'sirius-card__section-content'}>{children}</div>
    </div>
  );
}

export function SiriusCard({
  title,
  subtitle,
  action,
  actions,
  children,
  padded = true,
  subdued = false,
  footer,
  primaryFooterAction,
  secondaryFooterActions,
  className = '',
}: SiriusCardProps) {
  const headerActions = actions || action;
  const hasHeader = Boolean(title || headerActions);
  const hasFooterActions = Boolean(
    primaryFooterAction || (secondaryFooterActions && secondaryFooterActions.length > 0)
  );

  return (
    <section
      className={`sirius-card ${subdued ? 'sirius-card--subdued' : ''} ${className}`}
    >
      {hasHeader && (
        <div className="sirius-card__header">
          <div className="sirius-card__header-text">
            {typeof title === 'string' ? (
              <h2 className="sirius-card__title">{title}</h2>
            ) : (
              title
            )}
            {subtitle && (
              <p className="sirius-card__subtitle">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="sirius-card__action">{headerActions}</div>
          )}
        </div>
      )}

      <div className={`sirius-card__body ${!padded ? 'sirius-card__body--flush' : ''}`}>
        {children}
      </div>

      {(footer || hasFooterActions) && (
        <div className="sirius-card__footer">
          {footer ? (
            footer
          ) : (
            <div className="sirius-card__footer-actions">
              {secondaryFooterActions?.map((act, idx) => (
                <SiriusButton
                  key={idx}
                  variant={
                    act.variant ||
                    (act.destructive ? 'destructive-plain' : 'default')
                  }
                  onClick={act.onClick || act.onAction}
                  loading={act.loading}
                  disabled={act.disabled}
                >
                  {act.text || act.content}
                </SiriusButton>
              ))}

              {primaryFooterAction && (
                <SiriusButton
                  variant={
                    primaryFooterAction.variant ||
                    (primaryFooterAction.destructive ? 'destructive' : 'primary')
                  }
                  onClick={primaryFooterAction.onClick || primaryFooterAction.onAction}
                  loading={primaryFooterAction.loading}
                  disabled={primaryFooterAction.disabled}
                >
                  {primaryFooterAction.text || primaryFooterAction.content}
                </SiriusButton>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// Support de la notation Polaris Card.Section
SiriusCard.Section = SiriusCardSection;

export { SiriusCard as Card };
