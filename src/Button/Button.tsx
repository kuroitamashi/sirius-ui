'use client';

import React from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import './button.css';

export interface SiriusButtonProps {
  children?: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'plain'
    | 'destructive'
    | 'destructive-outline'
    | 'destructive-plain'
    | 'success'
    | 'brand';
  size?: 'slim' | 'medium' | 'large';
  /** Icône préfixe à gauche (nom d'icône Sirius ou composant ReactNode) */
  icon?: IconName | React.ReactNode;
  /** Icône suffixe à droite */
  suffixIcon?: IconName | React.ReactNode;
  /** Affiche l'icône chevron vers le bas ou le haut pour les menus déroulants (standard Polaris) */
  disclosure?: boolean | 'down' | 'up' | 'select';
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
}

export function SiriusButton({
  children,
  variant = 'secondary',
  size = 'medium',
  icon,
  suffixIcon,
  disclosure,
  iconOnly = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  href,
  external = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
}: SiriusButtonProps) {
  const classes = [
    'sirius-btn',
    `sirius-btn--${variant}`,
    size !== 'medium' && `sirius-btn--${size}`,
    iconOnly && 'sirius-btn--icon-only',
    fullWidth && 'sirius-btn--full-width',
    loading && 'sirius-btn--loading',
    disclosure && 'sirius-btn--disclosure',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'slim' ? 14 : 16;
  const chevronSize = size === 'slim' ? 12 : 14;

  const renderIcon = (ic: IconName | React.ReactNode) => {
    if (!ic) return null;
    if (typeof ic === 'string') {
      return <Icon name={ic as IconName} size={iconSize} />;
    }
    return ic;
  };

  const renderDisclosure = () => {
    if (!disclosure) return null;
    let chevronName: IconName = 'chevron-down';
    if (disclosure === 'up') chevronName = 'chevron-up';
    if (disclosure === 'select') chevronName = 'sort';
    return (
      <span className="sirius-btn__disclosure">
        <Icon name={chevronName} size={chevronSize} />
      </span>
    );
  };

  const content = (
    <>
      {loading ? (
        <span className="sirius-btn__spinner" aria-hidden="true" />
      ) : (
        icon && <span className="sirius-btn__icon">{renderIcon(icon)}</span>
      )}
      {!iconOnly && children && <span className="sirius-btn__text">{children}</span>}
      {suffixIcon && !loading && (
        <span className="sirius-btn__suffix-icon">{renderIcon(suffixIcon)}</span>
      )}
      {renderDisclosure()}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
