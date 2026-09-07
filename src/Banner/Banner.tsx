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
  info: <Icon name="info" size={18} />,
  success: <Icon name="check-circle" size={18} />,
  warning: <Icon name="alert-triangle" size={18} />,
  critical: <Icon name="alert-circle" size={18} />,
};

const CloseIcon = <Icon name="x" size={14} />;

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
                  className="sirius-btn sirius-btn--secondary sirius-btn--slim"
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
                  className="sirius-btn sirius-btn--secondary sirius-btn--slim"
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
  const isCompact = !title;

  return (
    <div
      className={`sirius-banner sirius-banner--layout-subdued sirius-banner--${tone} ${isCompact ? 'sirius-banner--compact' : ''} ${className}`}
      role="status"
    >
      <div className="sirius-banner__icon">{renderedIcon}</div>
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
                className="sirius-btn sirius-btn--secondary sirius-btn--slim"
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
