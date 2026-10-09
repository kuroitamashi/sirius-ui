'use client';

import React from 'react';
import './banner.css';

export type SiriusBannerTone = 'info' | 'success' | 'warning' | 'critical';
export type SiriusBannerLayout = 'subdued' | 'header' | 'card';

export interface SiriusBannerAction {
  content: string;
  onAction?: () => void;
  url?: string;
}

export interface SiriusBannerProps {
  /**
   * Titre du banner (Heading)
   */
  title?: string;
  /**
   * Corps du message
   */
  children?: React.ReactNode;
  /**
   * Tonalité selon Sirius / Figma : info | success | warning | critical
   */
  tone?: SiriusBannerTone;
  /**
   * Disposition visuelle selon la grille Figma :
   * - 'header' : barre supérieure unie colorée avec corps blanc
   * - 'card' : carte blanche avec badge icône squircle
   * - 'subdued' : fond teinté uniforme avec ou sans titre (défaut)
   */
  layout?: SiriusBannerLayout;
  /**
   * Lien d'action inline (ex: "Link text")
   */
  link?: {
    text: string;
    url?: string;
    onClick?: () => void;
  };
  /**
   * Action principale (bouton)
   */
  action?: SiriusBannerAction;
  /**
   * Action secondaire (bouton)
   */
  secondaryAction?: SiriusBannerAction;
  /**
   * Callback de fermeture (affiche la croix ✕ si défini)
   */
  onDismiss?: () => void;
  /**
   * Icône personnalisée de remplacement
   */
  icon?: React.ReactNode;
  className?: string;
}

import { Icon } from '../Icon/Icon';

// Icônes officielles Sirius UI
const ToneIcons: Record<SiriusBannerTone, React.ReactNode> = {
  info: <Icon name="info" size={20} />,
  success: <Icon name="check-circle" size={20} />,
  warning: <Icon name="alert-triangle" size={20} />,
  critical: <Icon name="alert-circle" size={20} />,
};

/* Icônes pleines de la disposition subdued : un disque à la couleur du ton
   et le signe en blanc par-dessus. Polaris n'a pas de version pleine de ces
   icônes, d'où le dessin ici, dans le même cadre 20x20 (disque de 16px). */
function FilledToneIcon({ tone }: { tone: SiriusBannerTone }) {
  const blanc = { fill: '#ffffff' };
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="8" fill="currentColor" />
      {tone === 'success' ? (
        <path d="M6.75 10.25 9 12.5l4.25-4.5" fill="none" stroke="#ffffff" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" />
      ) : tone === 'info' ? (
        <>
          <circle cx="10" cy="6.75" r="1" style={blanc} />
          <rect x="9.25" y="8.75" width="1.5" height="5.25" rx="0.75" style={blanc} />
        </>
      ) : (
        <>
          <rect x="9.25" y="5.75" width="1.5" height="5.25" rx="0.75" style={blanc} />
          <circle cx="10" cy="13.25" r="1" style={blanc} />
        </>
      )}
    </svg>
  );
}

const CloseIcon = <Icon name="x" size={20} />;

export function SiriusBanner({
  title,
  children,
  tone = 'info',
  layout = 'subdued',
  link,
  action,
  secondaryAction,
  onDismiss,
  icon,
  className = '',
}: SiriusBannerProps) {
  const renderedIcon = icon ?? ToneIcons[tone];

  // =========================================================================
  // DISPOSITION 1 : HEADER BAR (Barre supérieure unie colorée + corps blanc)
  // =========================================================================
  if (layout === 'header') {
    return (
      <div
        className={`sirius-banner sirius-banner--layout-header sirius-banner--${tone} ${className}`}
        role="status"
      >
        <div className="sirius-banner__header-bar">
          <div className="sirius-banner__header-left">
            <span className="sirius-banner__header-icon">{renderedIcon}</span>
            <span className="sirius-banner__header-title">{title ?? 'Heading'}</span>
          </div>
          {onDismiss && (
            <button
              type="button"
              className="sirius-banner__header-dismiss"
              onClick={onDismiss}
              aria-label="Fermer"
            >
              {CloseIcon}
            </button>
          )}
        </div>
        <div className="sirius-banner__body-container">
          <div className="sirius-banner__body-text">
            {children}
            {link && (
              <>
                {' '}
                {link.url ? (
                  <a href={link.url} className="sirius-banner__link">
                    {link.text}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={link.onClick}
                    className="sirius-banner__link sirius-banner__link--btn"
                  >
                    {link.text}
                  </button>
                )}
              </>
            )}
          </div>
          {(action || secondaryAction) && (
            <div className="sirius-banner__actions">
              {action && (
                <button
                  type="button"
                  onClick={action.onAction}
                  className="sirius-btn sirius-btn--primary sirius-btn--slim"
                >
                  {action.content}
                </button>
              )}
              {secondaryAction && (
                <button
                  type="button"
                  onClick={secondaryAction.onAction}
                  className="sirius-btn sirius-btn--default sirius-btn--slim"
                >
                  {secondaryAction.content}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // DISPOSITION 2 : CARD (Carte blanche avec badge squircle coloré)
  // =========================================================================
  if (layout === 'card') {
    return (
      <div
        className={`sirius-banner sirius-banner--layout-card sirius-banner--${tone} ${className}`}
        role="status"
      >
        <div className="sirius-banner__card-badge">{renderedIcon}</div>
        <div className="sirius-banner__content">
          {title && <div className="sirius-banner__title">{title}</div>}
          <div className="sirius-banner__body">
            {children}
            {link && (
              <>
                {' '}
                {link.url ? (
                  <a href={link.url} className="sirius-banner__link">
                    {link.text}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={link.onClick}
                    className="sirius-banner__link sirius-banner__link--btn"
                  >
                    {link.text}
                  </button>
                )}
              </>
            )}
          </div>
          {(action || secondaryAction) && (
            <div className="sirius-banner__actions">
              {action && (
                <button
                  type="button"
                  onClick={action.onAction}
                  className="sirius-btn sirius-btn--default sirius-btn--slim"
                >
                  {action.content}
                </button>
              )}
              {secondaryAction && (
                <button
                  type="button"
                  onClick={secondaryAction.onAction}
                  className="sirius-btn sirius-btn--plain sirius-btn--slim"
                >
                  {secondaryAction.content}
                </button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            className="sirius-banner__dismiss"
            onClick={onDismiss}
            aria-label="Fermer"
          >
            {CloseIcon}
          </button>
        )}
      </div>
    );
  }

  // =========================================================================
  // DISPOSITION 3 : SUBDUED (Fond teinté doux Sirius avec ou sans titre)
  // =========================================================================
  const subduedIcon = icon ?? <FilledToneIcon tone={tone} />;
  const corps = (children || link) && (
    <>
      {children}
      {link && (
        <>
          {' '}
          {link.url ? (
            <a href={link.url} className="sirius-banner__link">
              {link.text}
            </a>
          ) : (
            <button
              type="button"
              onClick={link.onClick}
              className="sirius-banner__link sirius-banner__link--btn"
            >
              {link.text}
            </button>
          )}
        </>
      )}
    </>
  );

  /* Structure Shopify : l'icône et le titre sur une ligne, puis le texte et
     les actions calés sur le bord gauche, sans retrait sous l'icône. Sans
     titre, c'est le texte qui prend place à côté de l'icône. */
  return (
    <div
      className={`sirius-banner sirius-banner--layout-subdued sirius-banner--${tone} ${className}`}
      role="status"
    >
      <div className="sirius-banner__head">
        <span className="sirius-banner__icon">{subduedIcon}</span>
        <div className={title ? 'sirius-banner__title' : 'sirius-banner__body'}>
          {title ?? corps}
        </div>
        {onDismiss && (
          <button
            type="button"
            className="sirius-banner__dismiss"
            onClick={onDismiss}
            aria-label="Fermer"
          >
            {CloseIcon}
          </button>
        )}
      </div>
      {title && corps && <div className="sirius-banner__body">{corps}</div>}
      {(action || secondaryAction) && (
        <div className="sirius-banner__actions">
          {action && (
            <button type="button" onClick={action.onAction} className="sirius-banner__action">
              {action.content}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onAction}
              className="sirius-banner__action sirius-banner__action--plain"
            >
              {secondaryAction.content}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
