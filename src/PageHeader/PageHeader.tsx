'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import './page-header.css';

export interface SiriusBreadcrumbItem {
  label: React.ReactNode;
  url?: string;
  onClick?: () => void;
}

export interface SiriusPageHeaderProps {
  /**
   * Icône d'en-tête (par exemple 'order-draft', 'tag', 'product')
   */
  icon?: string | React.ReactNode;
  /**
   * Action au clic sur l'icône
   */
  onIconClick?: () => void;
  /**
   * URL de navigation au clic sur l'icône
   */
  iconUrl?: string;
  /**
   * Label accessible pour les lecteurs d'écran
   */
  iconAriaLabel?: string;
  /**
   * Force l'affichage de l'état survol (fond gris + coins arrondis comme dans Figma)
   */
  iconHovered?: boolean;
  /**
   * Fil d'Ariane optionnel
   */
  breadcrumbs?: SiriusBreadcrumbItem[];
  /**
   * Titre principal de la page
   */
  title: React.ReactNode;
  /**
   * Sous-titre ou métadonnée (ex: "Updated by an app August 28, 10:50 am")
   */
  subtitle?: React.ReactNode;
  /**
   * Actions optionnelles à droite
   */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * En-tête de page avec fil d'Ariane Sirius / Sirius
 * Reproduction 1:1 du composant Figma ❖ Page
 */
export function SiriusPageHeader({
  icon = 'tag',
  onIconClick,
  iconUrl,
  iconAriaLabel,
  iconHovered = false,
  breadcrumbs,
  title = 'Page title',
  subtitle,
  actions,
  className = '',
}: SiriusPageHeaderProps) {
  const renderIconButton = () => {
    if (!icon) return null;

    const iconContent = typeof icon === 'string' ? <Icon name={icon} size={16} /> : icon;
    const btnClass = [
      'sirius-page-header__icon-btn',
      iconHovered && 'sirius-page-header__icon-btn--hovered',
    ]
      .filter(Boolean)
      .join(' ');

    if (iconUrl) {
      return (
        <a
          href={iconUrl}
          className={btnClass}
          aria-label={iconAriaLabel ?? 'Retour ou action'}
        >
          {iconContent}
        </a>
      );
    }

    return (
      <button
        type="button"
        className={btnClass}
        onClick={onIconClick}
        aria-label={iconAriaLabel ?? 'Action contextuelle'}
      >
        {iconContent}
      </button>
    );
  };

  return (
    <div className={['sirius-page-header', className].filter(Boolean).join(' ')}>
      <div className="sirius-page-header__content">
        <div className="sirius-page-header__main">
          {/* Icône bouton interactive avec hover & border-radius */}
          {renderIconButton()}

          {/* Éléments du fil d'Ariane si présents */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span className="sirius-page-header__separator">
                    <Icon name="chevron-right" size={12} />
                  </span>
                  {crumb.url || crumb.onClick ? (
                    <a
                      href={crumb.url ?? '#'}
                      onClick={(e) => {
                        if (crumb.onClick) {
                          e.preventDefault();
                          crumb.onClick();
                        }
                      }}
                      className="sirius-page-header__breadcrumb-link"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="sirius-page-header__breadcrumb-text">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </>
          )}

          {/* Séparateur vers le titre */}
          <span className="sirius-page-header__separator">
            <Icon name="chevron-right" size={12} />
          </span>

          {/* Titre de la page */}
          <h1 className="sirius-page-header__title">{title}</h1>
        </div>

        {/* Sous-titre / Métadonnée d'horodatage */}
        {subtitle && (
          <div className="sirius-page-header__subtitle">
            {subtitle}
          </div>
        )}
      </div>

      {actions && (
        <div className="sirius-page-header__actions">{actions}</div>
      )}
    </div>
  );
}

export default SiriusPageHeader;
