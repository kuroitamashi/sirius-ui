'use client';

import React from 'react';
import './link.css';

export interface SiriusLinkProps {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  subdued?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SiriusLink({
  children,
  href,
  external = false,
  subdued = false,
  onClick,
  className = '',
}: SiriusLinkProps) {
  const classes = [
    'sirius-link',
    subdued && 'sirius-link--subdued',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!href) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
