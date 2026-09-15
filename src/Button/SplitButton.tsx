'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SiriusButton, type SiriusButtonProps } from './Button';
import { Icon, type IconName } from '../Icon/Icon';
import {
  SiriusActionList,
  type SiriusActionListItemDescriptor,
  type SiriusActionListSection,
} from '../ActionList/ActionList';
import './split-button.css';

export interface SiriusSplitButtonPrimaryAction {
  /** Libellé du bouton principal */
  content?: React.ReactNode;
  /** Gestionnaire de clic principal */
  onAction?: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  icon?: IconName | React.ReactNode;
}

export interface SiriusSplitButtonProps {
  /**
   * Action principale (clic direct sur le bouton gauche).
   * Peut être passé via cet objet ou via `children` + `onClick`.
   */
  primaryAction?: SiriusSplitButtonPrimaryAction;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * Liste plate d'actions secondaires pour le menu déroulant du chevron.
   */
  actions?: SiriusActionListItemDescriptor[];

  /**
   * Liste groupée d'actions secondaires avec sections.
   */
  sections?: SiriusActionListSection[];

  /**
   * Gestionnaire de clic sur le chevron si vous gérez le popover vous-même.
   */
  onDisclosureClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * Libellé d'accessibilité du chevron (défaut : "Plus d'actions").
   */
  disclosureAriaLabel?: string;

  /**
   * Variante de couleur Sirius UI :
   * - 'secondary' : Noir tactile (comme dans la capture Shopify Polaris)
   * - 'default'   : Blanc avec bordure biseautée
   * - 'primary'   : Vert SKS signature
   * - 'destructive', etc.
   */
  variant?: SiriusButtonProps['variant'];

  /** Taille du bouton */
  size?: 'slim' | 'medium' | 'large';

  /** Désactive l'ensemble du SplitButton */
  disabled?: boolean;

  /** Indicateur de chargement sur l'action principale */
  loading?: boolean;

  /** Pleine largeur */
  fullWidth?: boolean;

  /** Classes CSS personnalisées */
  className?: string;
}

export function SiriusSplitButton({
  primaryAction,
  children,
  onClick,
  actions,
  sections,
  onDisclosureClick,
  disclosureAriaLabel = "Plus d'options",
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}: SiriusSplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasMenu = Boolean((actions && actions.length > 0) || (sections && sections.length > 0));

  // Fermeture automatique au clic en dehors
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleMainClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (primaryAction?.onAction) {
      primaryAction.onAction();
    }
    if (primaryAction?.onClick) {
      primaryAction.onClick(e);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const handleDisclosure = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (onDisclosureClick) {
      onDisclosureClick(e);
    }
    if (hasMenu) {
      setIsOpen((prev) => !prev);
    }
  };

  const mainContent = primaryAction?.content ?? children ?? 'Action';
  const mainLoading = loading || primaryAction?.loading;
  const mainDisabled = disabled || primaryAction?.disabled;

  return (
    <div
      ref={containerRef}
      className={[
        'sirius-split-button',
        `sirius-split-button--${variant}`,
        size !== 'medium' && `sirius-split-button--${size}`,
        fullWidth && 'sirius-split-button--full-width',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Bouton d'action principale (gauche) */}
      <SiriusButton
        variant={variant}
        size={size}
        disabled={mainDisabled}
        loading={mainLoading}
        onClick={handleMainClick}
        ariaLabel={primaryAction?.ariaLabel}
        icon={primaryAction?.icon}
        className="sirius-split-button__main"
      >
        {mainContent}
      </SiriusButton>

      {/* Séparateur vertical tactile */}
      <div className="sirius-split-button__divider" aria-hidden="true" />

      {/* Bouton chevron de disclosure (droite) */}
      <SiriusButton
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={handleDisclosure}
        ariaLabel={disclosureAriaLabel}
        className="sirius-split-button__disclosure"
        icon={<Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={size === 'slim' ? 12 : 14} />}
      />

      {/* Menu déroulant ActionList */}
      {hasMenu && isOpen && (
        <div className="sirius-split-button__popover" role="menu">
          <SiriusActionList
            items={actions}
            sections={sections}
            onOpenChange={(open) => setIsOpen(open)}
            closeOnSelect
          />
        </div>
      )}
    </div>
  );
}

export { SiriusSplitButton as SplitButton };
export type { SiriusSplitButtonProps as SplitButtonProps };
