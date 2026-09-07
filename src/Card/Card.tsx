import React from 'react';
import './card.css';

export interface SiriusCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  padded?: boolean;
  subdued?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export function SiriusCard({
  title,
  subtitle,
  action,
  children,
  padded = true,
  subdued = false,
  footer,
  className = '',
}: SiriusCardProps) {
  const hasHeader = Boolean(title || action);

  return (
    <section
      className={`sirius-card ${subdued ? 'sirius-card--subdued' : ''} ${className}`}
    >
      {hasHeader && (
        <div className="sirius-card__header">
          <div className="sirius-card__header-text">
            {typeof title === 'string' ? (
              <h2 className="sirius-card__title">{title}</h2>
            ) : (
              title
            )}
            {subtitle && (
              <p className="sirius-card__subtitle">{subtitle}</p>
            )}
          </div>
          {action && <div className="sirius-card__action">{action}</div>}
        </div>
      )}
      <div className={`sirius-card__body ${!padded ? 'sirius-card__body--flush' : ''}`}>
        {children}
      </div>
      {footer && <div className="sirius-card__footer">{footer}</div>}
    </section>
  );
}

export function SiriusCardSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`sirius-card__section ${className}`}>{children}</div>;
}
