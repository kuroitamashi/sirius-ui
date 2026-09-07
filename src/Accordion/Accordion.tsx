'use client';

import React, { useState } from 'react';
import { Icon } from '../Icon/Icon';
import './accordion.css';

export interface SiriusAccordionItemProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SiriusAccordionItem({
  title,
  icon,
  badge,
  children,
  defaultOpen = false,
}: SiriusAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`sirius-accordion-item ${
        isOpen ? 'sirius-accordion-item--open' : ''
      }`}
    >
      <button
        type="button"
        className="sirius-accordion-item__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="sirius-accordion-item__title-wrap">
          {icon && (
            <span className="sirius-accordion-item__icon">{icon}</span>
          )}
          <span className="sirius-accordion-item__title">{title}</span>
          {badge && (
            <span className="sirius-accordion-item__badge">{badge}</span>
          )}
        </div>
        <span className="sirius-accordion-item__chevron">
          <Icon name="chevron" size={14} />
        </span>
      </button>

      {isOpen && (
        <div className="sirius-accordion-item__content">{children}</div>
      )}
    </div>
  );
}

export function SiriusAccordion({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`sirius-accordion ${className}`}>{children}</div>;
}
