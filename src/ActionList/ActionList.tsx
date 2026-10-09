'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import './action-list.css';

export interface SiriusActionListItemDescriptor {
  id?: string;
  /** Libellé principal de l'action */
  content?: React.ReactNode;
  /** Alias pour content */
  label?: React.ReactNode;
  /** Texte d'aide ou description secondaire affichée sous le libellé */
  helpText?: React.ReactNode;
  /** Icône à gauche (nom d'icône Sirius ou composant ReactNode) */
  icon?: IconName | React.ReactNode;
  /** URL d'une image miniature à gauche */
  image?: string;
  /** Élément préfixe libre à gauche */
  prefix?: React.ReactNode;
  /** Élément suffixe à droite (ex: coche 'check', badge, raccourci clavier) */
  suffix?: React.ReactNode;
  /** Badge optionnel affiché à droite */
  badge?: React.ReactNode;
  /** Action destructrice (couleur rouge sirius-critical) */
  destructive?: boolean;
  /** Désactive l'action */
  disabled?: boolean;
  /** État sélectionné ou actif (fond subtilement grisé) */
  active?: boolean;
  /** Lien de destination si l'élément navigue */
  url?: string;
  external?: boolean;
  /** Gestionnaire de clic (standard Polaris) */
  onAction?: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  role?: string;
}

export interface SiriusActionListSection {
  title?: string;
  items: SiriusActionListItemDescriptor[];
}

export interface SiriusActionListProps {
  /** Liste plate d'actions */
  items?: SiriusActionListItemDescriptor[];
  /** Liste groupée par sections avec ou sans titre */
  sections?: SiriusActionListSection[];
  /** Rôle d'accessibilité ARIA pour les éléments */
  actionRole?: 'menuitem' | 'option';
  /** Bouton déclencheur optionnel pour transformer l'ActionList en menu déroulant (Popover) */
  trigger?: React.ReactNode;
  /** État ouvert en mode contrôlé */
  open?: boolean;
  /** Notifie du changement d'ouverture */
  onOpenChange?: (open: boolean) => void;
  /** Ferme automatiquement le menu au clic sur un élément actif (défaut: true) */
  closeOnSelect?: boolean;
  className?: string;
}

export function SiriusActionList({
  items,
  sections,
  actionRole = 'menuitem',
  trigger,
  open: controlledOpen,
  onOpenChange,
  closeOnSelect = true,
  className = '',
}: SiriusActionListProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const containerRef = useRef<HTMLDivElement>(null);

  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  // Fermeture au clic extérieur et touche Échap lorsque trigger est utilisé
  useEffect(() => {
    if (!trigger || !isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [trigger, isOpen]);

  // Normalisation des sections : si `items` est passé, on crée une section unique sans titre
  const normalizedSections: SiriusActionListSection[] = sections
    ? sections
    : items
    ? [{ items }]
    : [];

  const renderPrefix = (item: SiriusActionListItemDescriptor) => {
    if (item.prefix) return <span className="sirius-action-list__prefix">{item.prefix}</span>;
    if (item.image) {
      return (
        <span className="sirius-action-list__image">
          <img src={item.image} alt="" />
        </span>
      );
    }
    if (item.icon) {
      return (
        <span className="sirius-action-list__icon">
          {typeof item.icon === 'string' ? (
            <Icon name={item.icon as IconName} size={20} />
          ) : (
            item.icon
          )}
        </span>
      );
    }
    return null;
  };

  const renderSuffix = (item: SiriusActionListItemDescriptor) => {
    if (item.suffix) {
      return (
        <span className="sirius-action-list__suffix">
          {typeof item.suffix === 'string' ? (
            <Icon name={item.suffix as IconName} size={16} />
          ) : (
            item.suffix
          )}
        </span>
      );
    }
    if (item.badge) {
      return <span className="sirius-action-list__badge">{item.badge}</span>;
    }
    return null;
  };

  const renderItem = (item: SiriusActionListItemDescriptor, idx: number) => {
    const labelText = item.content ?? item.label;
    const isDestructive = Boolean(item.destructive);
    const isDisabled = Boolean(item.disabled);
    const isActive = Boolean(item.active);

    const itemClasses = [
      'sirius-action-list__item',
      isDestructive && 'sirius-action-list__item--destructive',
      isDisabled && 'sirius-action-list__item--disabled',
      isActive && 'sirius-action-list__item--active',
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      item.onClick?.(e);
      item.onAction?.();
      if (closeOnSelect && trigger) {
        setOpen(false);
      }
    };

    const innerContent = (
      <>
        {renderPrefix(item)}
        <div className="sirius-action-list__text">
          <span className="sirius-action-list__label">{labelText}</span>
          {item.helpText && (
            <span className="sirius-action-list__help-text">{item.helpText}</span>
          )}
        </div>
        {renderSuffix(item)}
      </>
    );

    if (item.url && !isDisabled) {
      return (
        <li key={item.id ?? idx} role="none">
          <a
            href={item.url}
            className={itemClasses}
            role={item.role ?? actionRole}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            onClick={handleClick}
          >
            {innerContent}
          </a>
        </li>
      );
    }

    return (
      <li key={item.id ?? idx} role="none">
        <button
          type="button"
          className={itemClasses}
          role={item.role ?? actionRole}
          disabled={isDisabled}
          onClick={handleClick}
        >
          {innerContent}
        </button>
      </li>
    );
  };

  const listMarkup = (
    <div className={`sirius-action-list ${trigger ? 'sirius-action-list--popover' : ''} ${className}`}>
      {normalizedSections.map((section, sIdx) => (
        <div key={sIdx} className="sirius-action-list__section">
          {section.title && (
            <p className="sirius-action-list__section-title">{section.title}</p>
          )}
          <ul className="sirius-action-list__items" role="menu">
            {section.items.map((item, iIdx) => renderItem(item, iIdx))}
          </ul>
        </div>
      ))}
    </div>
  );

  // Si trigger est fourni, on encapsule dans un conteneur popover interactif
  if (trigger) {
    return (
      <div className="sirius-action-list-wrapper" ref={containerRef}>
        <div
          className="sirius-action-list-trigger"
          onClick={() => setOpen(!isOpen)}
          role="button"
          tabIndex={0}
        >
          {trigger}
        </div>
        {isOpen && listMarkup}
      </div>
    );
  }

  return listMarkup;
}

export { SiriusActionList as ActionList };
