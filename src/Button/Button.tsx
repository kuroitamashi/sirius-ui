'use client';

import React from 'react';
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
  icon?: React.ReactNode;
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
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="sirius-btn__spinner" aria-hidden="true" />
      ) : (
        icon && <span className="sirius-btn__icon">{icon}</span>
      )}
      {!iconOnly && children && <span className="sirius-btn__text">{children}</span>}
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
