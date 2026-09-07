'use client';

import React, { useEffect, useCallback } from 'react';
import { Icon } from '../Icon/Icon';
import { SiriusButton } from '../Button/Button';
import './modal.css';

export interface SiriusModalAction {
  content: string;
  onAction?: () => void;
  loading?: boolean;
  disabled?: boolean;
  destructive?: boolean;
}

export interface SiriusModalProps {
  /**
   * Titre du modal (affiché en haut à gauche)
   */
  title?: React.ReactNode;
  /**
   * Contenu principal
   */
  children?: React.ReactNode;
  /**
   * État d'ouverture (pour le mode dialogue avec overlay).
   * Ignoré si `inline={true}`.
   */
  open?: boolean;
  /**
   * Fonction appelée lors de la fermeture (bouton X, ESC, clic backdrop)
   */
  onClose?: () => void;
  /**
   * Taille du modal :
   * - 'small' : ~380px (compact)
   * - 'medium' : ~580px (standard par défaut)
   * - 'large' : ~820px (large)
   * - 'full' : 100% (pleine largeur de son conteneur)
   */
  size?: 'small' | 'medium' | 'large' | 'full';
  /**
   * Action principale dans le pied de page (bouton sombre Sirius)
   */
  primaryAction?: SiriusModalAction;
  /**
   * Action(s) secondaire(s) dans le pied de page (bouton blanc contour)
   */
  secondaryActions?: SiriusModalAction[];
  /**
   * Mode inline : affiche le composant statiquement dans le flux de page
   * (fidèle à la présentation des composants Figma et à la vitrine Sirius)
   */
  inline?: boolean;
  className?: string;
}

export function SiriusModal({
  title = 'Title',
  children,
  open = false,
  onClose,
  size = 'medium',
  primaryAction,
  secondaryActions,
  inline = false,
  className = '',
}: SiriusModalProps) {
  // Gestion de la touche Échap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!inline && open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [inline, open, handleKeyDown]);

  if (!inline && !open) {
    return null;
  }

  const modalBox = (
    <div
      className={[
        'sirius-modal',
        `sirius-modal--${size}`,
        inline && 'sirius-modal--inline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role={inline ? undefined : 'dialog'}
      aria-modal={inline ? undefined : 'true'}
    >
      {/* ─── En-tête : Titre + Bouton de fermeture ─── */}
      <div className="sirius-modal__header">
        <h2 className="sirius-modal__title">{title}</h2>
        {onClose && (
          <button
            type="button"
            className="sirius-modal__close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      {/* ─── Corps : Contenu ─── */}
      <div className="sirius-modal__body">
        {children ?? <p className="sirius-modal__content-placeholder">Content</p>}
      </div>

      {/* ─── Pied de page : Actions alignées à droite ─── */}
      {(primaryAction || (secondaryActions && secondaryActions.length > 0)) && (
        <div className="sirius-modal__footer">
          <div className="sirius-modal__actions">
            {secondaryActions?.map((action, idx) => (
              <SiriusButton
                key={idx}
                variant="secondary"
                onClick={action.onAction}
                loading={action.loading}
                disabled={action.disabled}
              >
                {action.content}
              </SiriusButton>
            ))}
            {primaryAction && (
              <SiriusButton
                variant={primaryAction.destructive ? 'destructive' : 'primary'}
                onClick={primaryAction.onAction}
                loading={primaryAction.loading}
                disabled={primaryAction.disabled}
              >
                {primaryAction.content}
              </SiriusButton>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (inline) {
    return modalBox;
  }

  return (
    <div
      className="sirius-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      {modalBox}
    </div>
  );
}

export default SiriusModal;
