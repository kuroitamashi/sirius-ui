'use client';

import React, { useEffect, useRef } from 'react';
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
  /**
   * Pied de page libre, à la place de primaryAction / secondaryActions,
   * quand les boutons dépendent d'un état (envoi en cours, étape suivante).
   */
  footer?: React.ReactNode;
  className?: string;
}

const FOCUSABLE = 'input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href]';

export function SiriusModal({
  title = 'Title',
  children,
  open = false,
  onClose,
  size = 'medium',
  primaryAction,
  secondaryActions,
  inline = false,
  footer,
  className = '',
}: SiriusModalProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  // onClose change à chaque rendu du parent : dans les dépendances de l'effet,
  // chaque frappe relancerait l'effet et remettrait le focus au début.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  // Échap ferme ; à l'ouverture le focus va au premier champ (la croix s'il
  // n'y en a aucun), Tab ne sort jamais de la fenêtre, et le focus revient à
  // l'élément d'origine à la fermeture.
  useEffect(() => {
    if (inline || !open) return;
    const previous = document.activeElement as HTMLElement | null;
    const box = boxRef.current;
    (box?.querySelector<HTMLElement>('.sirius-modal__body :is(input, textarea, button, select):not([disabled])')
      ?? box?.querySelector<HTMLElement>('button:not([disabled]), [href]'))?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCloseRef.current) { e.preventDefault(); onCloseRef.current(); return; }
      if (e.key !== 'Tab') return;
      const targets = boxRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!targets?.length) return;
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [inline, open]);

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
      aria-label={typeof title === 'string' ? title : undefined}
      ref={boxRef}
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
            <Icon name="x" size={20} />
          </button>
        )}
      </div>

      {/* ─── Corps : Contenu ─── */}
      <div className="sirius-modal__body">
        {children ?? <p className="sirius-modal__content-placeholder">Content</p>}
      </div>

      {/* ─── Pied de page : Actions alignées à droite ─── */}
      {footer && <div className="sirius-modal__footer"><div className="sirius-modal__actions">{footer}</div></div>}
      {!footer && (primaryAction || (secondaryActions && secondaryActions.length > 0)) && (
        <div className="sirius-modal__footer">
          <div className="sirius-modal__actions">
            {secondaryActions?.map((action, idx) => (
              <SiriusButton
                key={idx}
                variant="default"
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
