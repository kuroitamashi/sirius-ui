'use client';

import React, { useEffect, useCallback } from 'react';
import './pagination.css';

export interface SiriusPaginationProps {
  /** Indique s'il y a une page suivante */
  hasNext?: boolean;
  /** Indique s'il y a une page précédente */
  hasPrevious?: boolean;
  /** URL de navigation pour la page suivante (rendu en <a> si présent) */
  nextURL?: string;
  /** URL de navigation pour la page précédente (rendu en <a> si présent) */
  previousURL?: string;
  /** Infobulle au survol du bouton suivant */
  nextTooltip?: string;
  /** Infobulle au survol du bouton précédent */
  previousTooltip?: string;
  /** Raccourcis clavier pour la page précédente (ex: ['j', 'ArrowLeft']) */
  previousKeys?: string[];
  /** Raccourcis clavier pour la page suivante (ex: ['k', 'ArrowRight']) */
  nextKeys?: string[];
  /** Callback déclenché au clic sur précédent */
  onPrevious?(): void;
  /** Callback déclenché au clic sur suivant */
  onNext?(): void;
  /** Texte ou élément affiché entre ou à côté des boutons */
  label?: React.ReactNode;
  /** Disposition optimisée pour tableau */
  type?: 'table';
  /** Libellé d'accessibilité ARIA */
  accessibilityLabel?: string;
  /** Identifiant HTML */
  id?: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Styles en ligne additionnels */
  style?: React.CSSProperties;
}

export const SiriusPagination: React.FC<SiriusPaginationProps> = ({
  hasNext = false,
  hasPrevious = false,
  nextURL,
  previousURL,
  nextTooltip,
  previousTooltip,
  previousKeys,
  nextKeys,
  onPrevious,
  onNext,
  label,
  type,
  accessibilityLabel = 'Pagination',
  id,
  className,
  style,
}) => {
  // Navigation au clavier
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ne pas intercepter si l'utilisateur saisit dans un champ de texte
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = event.key;

      const matchesPrev = previousKeys ? previousKeys.includes(key) : false;
      const matchesNext = nextKeys ? nextKeys.includes(key) : false;

      if (matchesPrev && hasPrevious && onPrevious) {
        event.preventDefault();
        onPrevious();
      } else if (matchesNext && hasNext && onNext) {
        event.preventDefault();
        onNext();
      }
    },
    [previousKeys, nextKeys, hasPrevious, hasNext, onPrevious, onNext]
  );

  useEffect(() => {
    if (!previousKeys && !nextKeys) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, previousKeys, nextKeys]);

  const chevronLeftIcon = (
    <svg
      viewBox="0 0 20 20"
      className="sirius-pagination__icon"
      focusable="false"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
        fill="currentColor"
      />
    </svg>
  );

  const chevronRightIcon = (
    <svg
      viewBox="0 0 20 20"
      className="sirius-pagination__icon"
      focusable="false"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
        fill="currentColor"
      />
    </svg>
  );

  // Rendu du bouton Précédent
  const renderPreviousButton = (isSegmented: boolean) => {
    const btnClass = [
      'sirius-pagination__button',
      isSegmented && 'sirius-pagination__button--segmented-prev',
      !hasPrevious && 'sirius-pagination__button--disabled',
    ]
      .filter(Boolean)
      .join(' ');

    if (previousURL && hasPrevious) {
      return (
        <a
          href={previousURL}
          className={btnClass}
          aria-label={previousTooltip || 'Page précédente'}
          title={previousTooltip}
          onClick={onPrevious}
        >
          {chevronLeftIcon}
        </a>
      );
    }

    return (
      <button
        type="button"
        className={btnClass}
        disabled={!hasPrevious}
        aria-label={previousTooltip || 'Page précédente'}
        title={previousTooltip}
        onClick={hasPrevious ? onPrevious : undefined}
      >
        {chevronLeftIcon}
      </button>
    );
  };

  // Rendu du bouton Suivant
  const renderNextButton = (isSegmented: boolean) => {
    const btnClass = [
      'sirius-pagination__button',
      isSegmented && 'sirius-pagination__button--segmented-next',
      !hasNext && 'sirius-pagination__button--disabled',
    ]
      .filter(Boolean)
      .join(' ');

    if (nextURL && hasNext) {
      return (
        <a
          href={nextURL}
          className={btnClass}
          aria-label={nextTooltip || 'Page suivante'}
          title={nextTooltip}
          onClick={onNext}
        >
          {chevronRightIcon}
        </a>
      );
    }

    return (
      <button
        type="button"
        className={btnClass}
        disabled={!hasNext}
        aria-label={nextTooltip || 'Page suivante'}
        title={nextTooltip}
        onClick={hasNext ? onNext : undefined}
      >
        {chevronRightIcon}
      </button>
    );
  };

  // Contenu principal de la pagination
  const paginationControls = label ? (
    // Mode avec libellé : boutons séparés avec libellé au milieu
    <div className="sirius-pagination__with-label">
      {renderPreviousButton(false)}
      <span className="sirius-pagination__label" aria-live="polite">
        {label}
      </span>
      {renderNextButton(false)}
    </div>
  ) : (
    // Mode compact sans libellé : segmented control avec séparateur central
    <div className="sirius-pagination__segmented-group">
      {renderPreviousButton(true)}
      <span className="sirius-pagination__divider" aria-hidden="true" />
      {renderNextButton(true)}
    </div>
  );

  return (
    <nav
      id={id}
      className={[
        'sirius-pagination',
        type === 'table' && 'sirius-pagination--table',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-label={accessibilityLabel}
      role="navigation"
    >
      {paginationControls}
    </nav>
  );
};

export default SiriusPagination;
