import React from 'react';
import './metric-card.css';

export interface SiriusMetricCardProps {
  label: string;
  value: string | number;
  delta?: number | null;
  deltaPeriod?: string;
  badge?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SiriusMetricCard({
  label,
  value,
  delta,
  deltaPeriod = 'vs période préc.',
  badge,
  active = false,
  onClick,
  className = '',
}: SiriusMetricCardProps) {
  const isUp = typeof delta === 'number' && delta > 0;
  const isDown = typeof delta === 'number' && delta < 0;

  return (
    <button
      type="button"
      className={`sirius-metric-card ${active ? 'sirius-metric-card--active' : ''} ${className}`}
      onClick={onClick}
      role="tab"
      aria-selected={active}
    >
      <div className="sirius-metric-card__header">
        <span className="sirius-metric-card__label">{label}</span>
        {badge && <span className="sirius-metric-card__badge">{badge}</span>}
      </div>

      <div className="sirius-metric-card__value">{value}</div>

      <div className="sirius-metric-card__footer">
        {typeof delta === 'number' ? (
          <span
            className={`sirius-metric-card__delta ${
              isUp
                ? 'sirius-metric-card__delta--up'
                : isDown
                ? 'sirius-metric-card__delta--down'
                : 'sirius-metric-card__delta--none'
            }`}
          >
            {isUp ? '↗ +' : isDown ? '↘ ' : ''}
            {Math.abs(delta).toLocaleString('fr-FR')}%
          </span>
        ) : (
          <span className="sirius-metric-card__delta--none">—</span>
        )}
        <span className="sirius-metric-card__delta-label">{deltaPeriod}</span>
      </div>
    </button>
  );
}
